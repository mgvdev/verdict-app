import {
  ConditionNode,
  FieldInfo,
  GroupNode,
  NodeModel,
  ScalarType,
} from '~/components/rules/ruleBuilder/types'
import { NumberInput, Select, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import React from 'react'

// Verdict imports
import {
  Engine,
  RuleSerializer,
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
      const first = obj.find((x) => x !== null)
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
      }
      arrayItems[path] = itemFields
      mergeFieldInfo(extractedFields, {
        path,
        type: 'array',
        item: itemFields,
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
export function toVerdict(nodeModel: NodeModel): any {
  /**
   * Handle group nodes (logical operations like AND/OR).
   */
  if ((nodeModel as GroupNode).kind === 'group') {
    const groupNode = nodeModel as GroupNode
    const childResults = groupNode.children.map((childNode) => toVerdict(childNode)).filter(Boolean)

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

  /**
   * Map condition operators to their corresponding functions.
   */
  switch (conditionNode.operator) {
    /**
     * Equal to comparison.
     */
    case 'eq':
      operationResult = eq(conditionNode.field!, conditionNode.value)
      break

    /**
     * Not equal to comparison.
     */
    case 'ne':
      operationResult = ne(conditionNode.field!, conditionNode.value)
      break

    /**
     * Greater than comparison.
     */
    case 'gt':
      operationResult = gt(conditionNode.field!, conditionNode.value)
      break

    /**
     * Greater than or equal to comparison.
     */
    case 'gte':
      operationResult = gte(conditionNode.field!, conditionNode.value)
      break

    /**
     * Less than comparison.
     */
    case 'lt':
      operationResult = lt(conditionNode.field!, conditionNode.value)
      break

    /**
     * Less than or equal to comparison.
     */
    case 'lte':
      operationResult = lte(conditionNode.field!, conditionNode.value)
      break

    /**
     * Inclusion check.
     */
    case 'In':
      operationResult = In(
        conditionNode.field!,
        Array.isArray(conditionNode.value) ? conditionNode.value : [conditionNode.value]
      )
      break

    /**
     * Exclusion check.
     */
    case 'notIn':
      operationResult = notIn(
        conditionNode.field!,
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
      const innerOperationResult = toVerdict(innerConditionNode)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      operationResult = anyOp(conditionNode.arrayPath, innerOperationResult)
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
      const innerOperationResult = toVerdict(innerConditionNode)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      operationResult = allOp(conditionNode.arrayPath, innerOperationResult)
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
      const innerOperationResult = toVerdict(innerConditionNode)

      if (!innerOperationResult) {
        operationResult = null
        break
      }

      operationResult = noneOp(conditionNode.arrayPath, innerOperationResult)
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
