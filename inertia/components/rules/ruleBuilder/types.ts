// ----------------------------- Utilities & Types ----------------------------

export type ScalarType = 'string' | 'number' | 'boolean' | 'date' | 'unknown'

export interface FieldInfo {
  path: string // e.g. "user.age" or "orders"
  type: 'scalar' | 'array' | 'object'
  scalar?: ScalarType // when type === 'scalar'
  item?: FieldInfo[] // when type === 'array' of objects; paths are RELATIVE to item
}

// Node model for the builder

export type GroupNode = {
  id: string
  kind: 'group'
  op: 'and' | 'or'
  children: NodeModel[]
}

export type SimpleOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'In' | 'notIn'

export type ConditionNode = {
  id: string
  kind: 'condition'
  negated?: boolean // NOT wrapper
  // Simple operators
  field?: string // left path, e.g. "user.age"
  operator?: SimpleOperator | 'any' | 'all' | 'none'
  value?: any // right-side value or array of values (for In/notIn)
  // Array operators
  arrayPath?: string // e.g. "user.roles"
  inner?: Omit<ConditionNode, 'id' | 'negated'> // for any/all/none: inner condition (relative paths)
}

export type NodeModel = GroupNode | ConditionNode

export const SIMPLE_OPERATOR_OPTIONS: { label: string; value: SimpleOperator }[] = [
  { label: 'equals', value: 'eq' },
  { label: 'not equals', value: 'ne' },
  { label: 'greater than', value: 'gt' },
  { label: '≥ greater or equal', value: 'gte' },
  { label: 'less than', value: 'lt' },
  { label: '≤ less or equal', value: 'lte' },
  { label: 'in list', value: 'In' },
  { label: 'not in list', value: 'notIn' },
]

export const ARRAY_OPERATOR_OPTIONS = [
  { label: 'ANY (at least one)', value: 'any' },
  { label: 'ALL (every item)', value: 'all' },
  { label: 'NONE (no item)', value: 'none' },
] as const
