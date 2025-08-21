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

export function ConditionRow({
  c,
  onChange,
  fields,
  arrayItems,
  onRemove,
}: {
  c: ConditionNode
  onChange: (next: ConditionNode) => void
  fields: FieldInfo[]
  arrayItems: Record<string, FieldInfo[]>
  onRemove: () => void
}) {
  const allFields = fields.filter((f) => f.type === 'scalar' || f.type === 'array')
  const isArraySelected = !!allFields.find(
    (f) => f.type === 'array' && (c.arrayPath ? f.path === c.arrayPath : f.path === c.field)
  )
  const currentArrayPath = isArraySelected ? (c.arrayPath ?? c.field) : undefined

  const selectedScalar = fields.find((f) => f.type === 'scalar' && f.path === c.field)

  const handleFieldChange = (v?: string) => {
    if (!v) {
      onChange({
        ...c,
        field: undefined,
        arrayPath: undefined,
        operator: undefined,
        value: undefined,
        inner: undefined,
      })
      return
    }
    const f = fields.find((x) => x.path === v)
    if (!f) return
    if (f.type === 'array') {
      onChange({
        ...c,
        field: undefined,
        arrayPath: v,
        operator:
          c.operator === 'any' || c.operator === 'all' || c.operator === 'none'
            ? c.operator
            : 'any',
        value: undefined,
        inner: c.inner ?? {
          kind: 'condition',
          field: (arrayItems[v] ?? [])[0]?.path,
          operator: 'eq',
        },
      })
    } else {
      onChange({
        ...c,
        field: v,
        arrayPath: undefined,
        inner: undefined,
        operator:
          c.operator &&
          (['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'In', 'notIn'] as any).includes(c.operator)
            ? c.operator
            : 'eq',
      })
    }
  }

  return (
    <Card withBorder radius="xs" padding="sm" style={{ background: 'var(--mantine-color-body)', boxShadow: "none" }}>
      <Group wrap="wrap" align="center" gap="sm">
        <Switch
          size="sm"
          checked={!!c.negated}
          onChange={(e) => onChange({ ...c, negated: e.currentTarget.checked })}
          onLabel="NOT"
          offLabel="NOT"
        />

        <Group>
          <Badge color="blue">Field</Badge>
          <Select
            searchable
            w={340}
            placeholder="Field path"
            value={isArraySelected ? currentArrayPath : c.field}
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
                value={(c.operator as any) ?? undefined}
                data={SIMPLE_OPERATOR_OPTIONS}
                onChange={(v) => onChange({ ...c, operator: (v as any) ?? undefined })}
              />
            </Group>

            {c.operator && ['In', 'notIn'].includes(c.operator) ? (
              <TagsInput
                w={340}
                placeholder="Values (press Enter)"
                value={Array.isArray(c.value) ? (c.value as any[]).map(String) : []}
                onChange={(vals) => onChange({ ...c, value: vals })}
                clearable
              />
            ) : (
              <ValueInput
                scalar={selectedScalar?.scalar}
                value={c.value}
                onChange={(v) => onChange({ ...c, value: v })}
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
                  (c.operator as any) === 'any' ||
                  (c.operator as any) === 'all' ||
                  (c.operator as any) === 'none'
                    ? (c.operator as any)
                    : 'any'
                }
                data={ARRAY_OPERATOR_OPTIONS as any}
                onChange={(v) => onChange({ ...c, operator: (v as any) ?? 'any' })}
              />
            </Group>

            <Card withBorder radius="xss" padding="xs" style={{ flex: 1, minWidth: 520 }}>
              <Text size="sm" c="dimmed" mb="xs">
                Inner condition (relative to each item)
              </Text>
              <InnerConditionEditor
                inner={c.inner ?? ({ kind: 'condition' } as any)}
                onChange={(inner) => onChange({ ...c, inner })}
                itemFields={arrayItems[currentArrayPath!] ?? []}
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
