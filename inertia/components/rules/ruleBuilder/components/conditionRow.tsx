import {
  ARRAY_OPERATOR_OPTIONS,
  ConditionNode,
  FieldInfo,
  SIMPLE_OPERATOR_OPTIONS,
} from '~/components/rules/ruleBuilder/types'
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  Select,
  Switch,
  TagsInput,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { ValueInput } from '~/components/rules/ruleBuilder/components/valueInput'
import { InnerConditionEditor } from '~/components/rules/ruleBuilder/components/innerConditionEditor'
import { serializedSelfSymbol } from '@mgvdev/verdict'

export function ConditionRow({
  conditionNode,
  onChange,
  fields,
  arrayItems,
  onRemove,
}: {
  conditionNode: ConditionNode
  onChange: (next: ConditionNode) => void
  fields: FieldInfo[]
  arrayItems: Record<string, FieldInfo[]>
  onRemove: () => void
}) {
  const allFields = fields.filter((f) => f.type === 'scalar' || f.type === 'array')
  const isArraySelected = !!allFields.find(
    (f) =>
      f.type === 'array' &&
      (conditionNode.arrayPath ? f.path === conditionNode.arrayPath : f.path === conditionNode.field)
  )
  const currentArrayPath = isArraySelected
    ? conditionNode.arrayPath ?? conditionNode.field
    : undefined

  const selectedScalar = fields.find((f) => f.type === 'scalar' && f.path === conditionNode.field)
  const selectedArrayInfo = fields.find((f) => f.path === currentArrayPath)

  const handleFieldChange = (v?: string) => {
    if (!v) {
      onChange({
        ...conditionNode,
        field: undefined,
        arrayPath: undefined,
        operator: undefined,
        value: undefined,
        inner: undefined,
      })
      return
    }
    const fieldInfo = fields.find((x) => x.path === v)
    if (!fieldInfo) return
    if (fieldInfo.type === 'array') {
      const isPrimitive = !fieldInfo.item || fieldInfo.item.length === 0
      onChange({
        ...conditionNode,
        field: undefined,
        arrayPath: v,
        operator:
          conditionNode.operator === 'any' ||
          conditionNode.operator === 'all' ||
          conditionNode.operator === 'none'
            ? conditionNode.operator
            : 'any',
        value: undefined,
        inner: conditionNode.inner ?? {
          kind: 'condition',
          field: isPrimitive ? serializedSelfSymbol : (arrayItems[v] ?? [])[0]?.path,
          operator: 'eq',
        },
      })
    } else {
      onChange({
        ...conditionNode,
        field: v,
        arrayPath: undefined,
        inner: undefined,
        operator:
          conditionNode.operator &&
          (['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'In', 'notIn'] as any).includes(
            conditionNode.operator
          )
            ? conditionNode.operator
            : 'eq',
      })
    }
  }

  return (
    <Card
      withBorder
      radius="xs"
      padding="sm"
      style={{ background: 'var(--mantine-color-body)', boxShadow: 'none' }}
    >
      <Group wrap="wrap" align="center" gap="sm">
        <Switch
          size="sm"
          checked={!!conditionNode.negated}
          onChange={(e) => onChange({ ...conditionNode, negated: e.currentTarget.checked })}
          onLabel="NOT"
          offLabel="NOT"
        />

        <Group>
          <Badge color="blue">Field</Badge>
          <Select
            searchable
            w={340}
            placeholder="Field path"
            value={isArraySelected ? currentArrayPath : conditionNode.field}
            data={allFields.map((f) => ({
              label: `${f.path}${f.type === 'array' ? '  [array]' : ''}`,
              value: f.path,
            }))}
            onChange={(v) => handleFieldChange(v ?? undefined)}
          />
        </Group>

        {!isArraySelected && (
          <>
            <Group>
              <Badge color="cyan">Operator</Badge>
              <Select
                w={220}
                placeholder="Operator"
                value={(conditionNode.operator as any) ?? undefined}
                data={SIMPLE_OPERATOR_OPTIONS}
                onChange={(v) => onChange({ ...conditionNode, operator: (v as any) ?? undefined })}
              />
            </Group>

            {conditionNode.operator && ['In', 'notIn'].includes(conditionNode.operator) ? (
              <TagsInput
                w={340}
                placeholder="Values (press Enter)"
                value={Array.isArray(conditionNode.value) ? (conditionNode.value as any[]).map(String) : []}
                onChange={(vals) => onChange({ ...conditionNode, value: vals })}
                clearable
              />
            ) : (
              <ValueInput
                scalar={selectedScalar?.scalar}
                value={conditionNode.value}
                onChange={(v) => onChange({ ...conditionNode, value: v })}
              />
            )}
          </>
        )}

        {isArraySelected && (
          <>
            <Flex direction="column" gap="xs" style={{ flex: 1 }}>
              <Group>
                <Badge color="cyan">Operator</Badge>
                <Select
                  placeholder="ANY / ALL / NONE"
                  value={
                    (conditionNode.operator as any) === 'any' ||
                    (conditionNode.operator as any) === 'all' ||
                    (conditionNode.operator as any) === 'none'
                      ? (conditionNode.operator as any)
                      : 'any'
                  }
                  data={ARRAY_OPERATOR_OPTIONS as any}
                  onChange={(v) => onChange({ ...conditionNode, operator: (v as any) ?? 'any' })}
                />
              </Group>

              <Card withBorder radius="xs" padding="xs" style={{ flex: 1, minWidth: 520 }}>
                <Text size="sm" c="dimmed" mb="xs">
                  Inner condition (relative to each item)
                </Text>
                <InnerConditionEditor
                  inner={conditionNode.inner ?? ({ kind: 'condition' } as any)}
                  onChange={(inner) => onChange({ ...conditionNode, inner })}
                  itemFields={arrayItems[currentArrayPath!] ?? []}
                  primitiveArrayScalarType={selectedArrayInfo?.scalar}
                />
              </Card>
            </Flex>
          </>
        )}

        <Tooltip label="Delete filter">
          <ActionIcon color="red" variant="light" onClick={onRemove}>
            <IconTrash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  )
}