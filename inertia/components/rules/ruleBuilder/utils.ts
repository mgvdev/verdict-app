import {
  ConditionNode,
  FieldInfo,
  GroupNode,
  NodeModel,
  ScalarType,
} from '~/components/rules/ruleBuilder/types'

// Verdict imports
import {
  self,
  serializedSelfSymbol,
  and,
  or,
  not,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  In,
  notIn,
  any as anyOp,
  all as allOp,
  none as noneOp,
  RuleJson,
} from '@mgvdev/verdict'

/*
 * Checks if a value is a date-like object.
 *
 * @param {any} v - The value to check.
 * @return {boolean} Returns true if the value is a date-like object, false otherwise.
 */
export function isDateLike(v: any): boolean {
  /*
   * Checks if the value is an instance of Date
   */
  if (v instanceof Date) return true

  /*
   * Checks if the value is a number within a reasonable date range
   */
  if (typeof v === 'number') {
    const isValidDate = v > 946684800000 && v < 4102444800000 // 2000..2100
    return isValidDate
  }

  /*
   * Checks if the value is a string that can be parsed to a date
   */
  if (typeof v === 'string') {
    const parsedDate = Date.parse(v)
    const isValidDate = !Number.isNaN(parsedDate)
    return isValidDate
  }

  return false
}

/*
 * Detects the scalar type of a value.
 *
 * @param {any} v - The value to check.
 * @return {ScalarType} The detected scalar type.
 */
export function detectScalarType(v: any): ScalarType {
  const type = typeof v

  /*
   * Checks if the value is a string
   */
  if (type === 'string') {
    const isDateLikeObject = isDateLike(v)
    return isDateLikeObject ? 'date' : 'string'
  }

  /*
   * Checks if the value is a number
   */
  if (type === 'number') {
    const isDateLikeObject = isDateLike(v)
    return isDateLikeObject ? 'date' : 'number'
  }

  /*
   * Checks if the value is a boolean
   */
  if (type === 'boolean') return 'boolean'

  /*
   * Checks if the value is an instance of Date
   */
  if (v instanceof Date) return 'date'

  return 'unknown'
}

/*
 * Adds a field to the fields array if it doesn't already exist.
 *
 * @param {FieldInfo[]} target - The fields array to add the field to.
 * @param {FieldInfo} incoming - The field to add.
 */
export function mergeFieldInfo(target: FieldInfo[], incoming: FieldInfo) {
  /*
   * Checks if the field already exists in the array
   */
  if (!target.find((field) => field.path === incoming.path)) {
    target.push(incoming)
  }
}

/*
 * Extracts fields from the given context object.
 *
 * @param {any} context - The context object to extract fields from.
 * @return {{ fields: FieldInfo[]; arrayItems: Record<string, FieldInfo[]> }}
 * An object containing the extracted fields and array items.
 */
export function extractFieldsFromContext(context: any): {
  fields: FieldInfo[]
  arrayItems: Record<string, FieldInfo[]>
} {
  const extractedFields: FieldInfo[] = []
  const arrayItems: Record<string, FieldInfo[]> = {}

  /*
   * Recursively walks through the context object to extract fields
   */
  function walk(obj: any, base: string) {
    /*
     * Returns if the value is null or undefined
     */
    if (obj === null || obj === undefined) return

    /*
     * Handles arrays
     */
    if (Array.isArray(obj)) {
      const path = base
      let itemFields: FieldInfo[] = []
      const first = obj.find((x) => x !== null && x !== undefined)
      let scalarType: ScalarType | undefined

      if (first && typeof first === 'object' && !Array.isArray(first)) {
        /*
         * Array of objects - collects relative fields
         */
        Object.keys(first).forEach((key) => {
          const value = (first as any)[key]
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            /*
             * Nested object - flattens one level deeper for suggestion
             */
            Object.keys(value).forEach((nestedKey) => {
              const nestedValue = (value as any)[nestedKey]
              if (typeof nestedValue !== 'object' || nestedValue instanceof Date) {
                itemFields.push({
                  path: `${key}.${nestedKey}`,
                  type: 'scalar',
                  scalar: detectScalarType(nestedValue),
                })
              }
            })
          } else if (Array.isArray(value)) {
            /*
             * Nested array of objects - out of scope for inner condition suggestion
             */
          } else {
            itemFields.push({
              path: key,
              type: 'scalar',
              scalar: detectScalarType(value),
            })
          }
        })
      } else if (typeof first !== 'undefined') {
        scalarType = detectScalarType(first)
      }
      arrayItems[path] = itemFields
      mergeFieldInfo(extractedFields, {
        path,
        type: 'array',
        item: itemFields,
        scalar: scalarType,
      })
      return
    }

    /*
     * Handles objects
     */
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const fullPath = base ? `${base}.${key}` : key
        const value = obj[key]
        if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          !(value instanceof Date)
        ) {
          /*
           * Object - recurses
           */
          mergeFieldInfo(extractedFields, {
            path: fullPath,
            type: 'object',
          })
          walk(value, fullPath)
        } else if (Array.isArray(value)) {
          walk(value, fullPath)
        } else {
          mergeFieldInfo(extractedFields, {
            path: fullPath,
            type: 'scalar',
            scalar: detectScalarType(value),
          })
        }
      })
    }
  }

  walk(context, '')
  return { fields: extractedFields, arrayItems }
}

/**
 * Converts a node model into a logical operation object.
 *
 * @param {NodeModel} nodeModel - The node model to process.
 * @return {any} The resulting logical operation object.
 */
export function toVerdict(nodeModel: NodeModel, fields: FieldInfo[]): any {
  /**
   * Handle group nodes (logical operations like AND/OR).
   */
  if ((nodeModel as GroupNode).kind === 'group') {
    const groupNode = nodeModel as GroupNode
    const childResults = groupNode.children
      .map((childNode) => toVerdict(childNode, fields))
      .filter(Boolean)

    /**
     * Apply logical AND operation if the group operator is 'and'.
     */
    if (groupNode.op === 'and') {
      return and(...(childResults as any[]))
    }

    /**
     * Apply logical OR operation if the group operator is 'or'.
     */
    return or(...(childResults as any[]))
  }

  /**
   * Handle condition nodes (comparisons and array operations).
   */
  const conditionNode = nodeModel as ConditionNode
  let operationResult: any = null

  const field = conditionNode.field === serializedSelfSymbol ? self : conditionNode.field

  /**
   * Map condition operators to their corresponding functions.
   */
  switch (conditionNode.operator) {
    /**
     * Equal to comparison.
     */
    case 'eq':
      operationResult = eq(field!, conditionNode.value)
      break

    /**
     * Not equal to comparison.
     */
    case 'ne':
      operationResult = ne(field!, conditionNode.value)
      break

    /**
     * Greater than comparison.
     */
    case 'gt':
      operationResult = gt(field!, conditionNode.value)
      break

    /**
     * Greater than or equal to comparison.
     */
    case 'gte':
      operationResult = gte(field!, conditionNode.value)
      break

    /**
     * Less than comparison.
     */
    case 'lt':
      operationResult = lt(field!, conditionNode.value)
      break

    /**
     * Less than or equal to comparison.
     */
    case 'lte':
      operationResult = lte(field!, conditionNode.value)
      break

    /**
     * Inclusion check.
     */
    case 'In':
      operationResult = In(
        field!,
        Array.isArray(conditionNode.value) ? conditionNode.value : [conditionNode.value]
      )
      break

    /**
     * Exclusion check.
     */
    case 'notIn':
      operationResult = notIn(
        field!,
        Array.isArray(conditionNode.value) ? conditionNode.value : [conditionNode.value]
      )
      break

    /**
     * Array inclusion check (any element satisfies the condition).
     */
    case 'any': {
      if (!conditionNode.arrayPath || !conditionNode.inner) {
        operationResult = null
        break
      }
      const innerConditionNode = {
        ...conditionNode.inner,
        id: 'inner',
        kind: 'condition',
      } as ConditionNode

      const arrayFieldInfo = fields.find((f) => f.path === conditionNode.arrayPath)
      const itemFields = arrayFieldInfo?.item ?? []
      const isPrimitiveArray = !itemFields || itemFields.length === 0

      const innerOperationResult = toVerdict(innerConditionNode, itemFields)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      const arrayPath = isPrimitiveArray ? `${conditionNode.arrayPath}.*` : conditionNode.arrayPath
      operationResult = anyOp(arrayPath, innerOperationResult)
      break
    }

    /**
     * Array inclusion check (all elements satisfy the condition).
     */
    case 'all': {
      if (!conditionNode.arrayPath || !conditionNode.inner) {
        operationResult = null
        break
      }
      const innerConditionNode = {
        ...conditionNode.inner,
        id: 'inner',
        kind: 'condition',
      } as ConditionNode
      const arrayFieldInfo = fields.find((f) => f.path === conditionNode.arrayPath)
      const itemFields = arrayFieldInfo?.item ?? []
      const isPrimitiveArray = !itemFields || itemFields.length === 0
      const innerOperationResult = toVerdict(innerConditionNode, itemFields)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      const arrayPath = isPrimitiveArray ? `${conditionNode.arrayPath}.*` : conditionNode.arrayPath
      operationResult = allOp(arrayPath, innerOperationResult)
      break
    }

    /**
     * Array exclusion check (none of the elements satisfy the condition).
     */
    case 'none': {
      if (!conditionNode.arrayPath || !conditionNode.inner) {
        operationResult = null
        break
      }
      const innerConditionNode = {
        ...conditionNode.inner,
        id: 'inner',
        kind: 'condition',
      } as ConditionNode
      const arrayFieldInfo = fields.find((f) => f.path === conditionNode.arrayPath)
      const itemFields = arrayFieldInfo?.item ?? []
      const isPrimitiveArray = !itemFields || itemFields.length === 0
      const innerOperationResult = toVerdict(innerConditionNode, itemFields)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      const arrayPath = isPrimitiveArray ? `${conditionNode.arrayPath}.*` : conditionNode.arrayPath
      operationResult = noneOp(arrayPath, innerOperationResult)
      break
    }

    default:
      operationResult = null
  }

  /**
   * Apply negation if the condition is marked as negated.
   */
  if (!operationResult) return null
  return conditionNode.negated ? not(operationResult) : operationResult
}

/**
 * Safely parses a JSON string and returns a fallback value if parsing fails.
 *
 * @param {string} inputString - The JSON string to parse.
 * @param {T} fallback - The value to return if parsing fails.
 * @return {T} The parsed value or the fallback.
 */
export function safeJsonParse<T = any>(inputString: string, fallback: T): T {
  /**
   * Attempt to parse the JSON string.
   */
  try {
    const parsedValue = JSON.parse(inputString)
    return parsedValue as T
  } catch {
    /**
     * Return the fallback value if parsing fails.
     */
    return fallback
  }
}

export function toNodeGroup(verdictJson: RuleJson): GroupNode {
  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const normalizeOp = (op: string): string => {
    switch (op) {
      case 'and':
      case 'or':
      case 'not':
      case 'eq':
      case 'ne':
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
      case 'any':
      case 'all':
      case 'none':
        return op
      case 'in':
      case 'In':
        return 'In'
      case 'notIn':
      case 'nin':
        return 'notIn'
      default:
        return op
    }
  }

  const toCondition = (json: RuleJson): ConditionNode => {
    const op = normalizeOp(json.operator)

    // Tableaux: any/all/none => args: [arrayPath, innerRule]
    if (op === 'any' || op === 'all' || op === 'none') {
      const [arrayPath, rawInner] = json.args as [string, RuleJson]

      // Support d'un NOT autour de l'inner
      let innerJson = rawInner
      let innerNegated = false
      if (innerJson?.operator === 'not') {
        innerNegated = true
        innerJson = (innerJson.args?.[0] as RuleJson) ?? innerJson
      }

      // L’inner doit être une condition simple (pas un groupe)
      const innerOp = normalizeOp(innerJson.operator)
      if (innerOp === 'and' || innerOp === 'or') {
        // Pas supporté par le builder: on prend le 1er enfant “simple” si dispo
        const first = (innerJson.args as RuleJson[]).find(
          (n) => !['and', 'or'].includes(normalizeOp(n.operator))
        )
        if (first) innerJson = first
      }

      const innerCond = toScalarCondition(innerJson)
      if (innerNegated) innerCond.negated = !innerCond.negated

      // On enlève id/kind dans inner (le builder les rajoute côté toVerdict)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id: _id, kind: _kind, ...innerNoMeta } = innerCond as any

      return {
        id: genId(),
        kind: 'condition',
        operator: op as any,
        arrayPath: String(arrayPath),
        inner: innerNoMeta,
        negated: false,
      }
    }

    // Comparateurs & (not)in
    return toScalarCondition(json)
  }

  const toScalarCondition = (json: RuleJson): ConditionNode => {
    const op = normalizeOp(json.operator)
    const [field, rawValue] = json.args as [string, unknown]

    // pour In/notIn, on s'assure d’un tableau si le JSON ne l’était pas
    const value =
      op === 'In' || op === 'notIn' ? (Array.isArray(rawValue) ? rawValue : [rawValue]) : rawValue

    return {
      id: genId(),
      kind: 'condition',
      operator: op as any,
      field: typeof field === 'string' ? field : String(field),
      value,
      negated: false,
    }
  }

  const toNode = (json: RuleJson): NodeModel => {
    const op = normalizeOp(json.operator)

    if (op === 'and' || op === 'or') {
      const children = (json.args as RuleJson[]).map(toNode) as NodeModel[]
      return {
        id: genId(),
        kind: 'group',
        op: op as 'and' | 'or',
        children,
      }
    }

    if (op === 'not') {
      const inner = json.args?.[0] as RuleJson
      if (!inner) {
        // NOT vide => condition neutre négative pour ne pas crasher l’UI
        return {
          id: genId(),
          kind: 'condition',
          operator: 'eq',
          field: '',
          value: null,
          negated: true,
        }
      }

      const innerOp = normalizeOp(inner.operator)
      if (innerOp === 'and' || innerOp === 'or') {
        // De Morgan: not(and(...)) => or(not a, not b, ...)
        const flipped: 'and' | 'or' = innerOp === 'and' ? 'or' : 'and'
        const children = (inner.args as RuleJson[]).map((c) =>
          toNode({ operator: 'not', args: [c] })
        )
        return {
          id: genId(),
          kind: 'group',
          op: flipped,
          children: children as GroupNode['children'],
        }
      }

      const cond = toCondition(inner)
      cond.negated = !cond.negated
      return cond
    }

    return toCondition(json)
  }

  // Toujours renvoyer un GroupNode à la racine
  const root = toNode(verdictJson)
  if (root.kind === 'group') return root as GroupNode
  return {
    id: genId(),
    kind: 'group',
    op: 'and',
    children: [root as ConditionNode],
  }
}
