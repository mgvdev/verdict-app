import {
  ConditionNode,
  FieldInfo,
  ScalarType,
  SIMPLE_OPERATOR_OPTIONS,
} from '~/components/rules/ruleBuilder/types'
import { Group, Select, TagsInput, Text } from '@mantine/core'
import { ValueInput } from '~/components/rules/ruleBuilder/components/valueInput'

export function InnerConditionEditor({
  inner,
  onChange,
  itemFields,
  primitiveArrayScalarType,
}: {
  inner: Omit<ConditionNode, 'id' | 'negated'>
  onChange: (c: Omit<ConditionNode, 'id' | 'negated'>) => void
  itemFields: FieldInfo[]
  primitiveArrayScalarType?: ScalarType
}) {
  const isPrimitive = itemFields.length === 0
  const scalarFields = itemFields.filter((f) => f.type === 'scalar')
  const selected = scalarFields.find((f) => f.path === inner.field)

  return (
    <Group wrap="wrap" gap="sm">
      <Group>
        {isPrimitive ? (
          <Text fw={500} size="sm">
            Item
          </Text>
        ) : (
          <Select
            searchable
            placeholder="item field"
            data={scalarFields.map((f) => ({ label: f.path, value: f.path }))}
            value={inner.field}
            onChange={(v) => onChange({ ...inner, field: v ?? undefined })}
          />
        )}
        <Select
          placeholder="op"
          data={SIMPLE_OPERATOR_OPTIONS}
          value={inner.operator as any}
          onChange={(v) => onChange({ ...inner, operator: (v as any) ?? undefined })}
        />
        {inner.operator && ['In', 'notIn'].includes(inner.operator) ? (
          <TagsInput
            placeholder="Values"
            value={Array.isArray(inner.value) ? inner.value.map((x: any) => String(x)) : []}
            onChange={(vals) => onChange({ ...inner, value: vals })}
            clearable
          />
        ) : (
          <ValueInput
            scalar={isPrimitive ? primitiveArrayScalarType : selected?.scalar}
            value={inner.value}
            onChange={(v) => onChange({ ...inner, value: v })}
          />
        )}
      </Group>
    </Group>
  )
}