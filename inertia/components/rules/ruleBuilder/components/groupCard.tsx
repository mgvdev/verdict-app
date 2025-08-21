import {
  ConditionNode,
  FieldInfo,
  GroupNode,
  NodeModel,
} from '~/components/rules/ruleBuilder/types'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  rem,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconBraces, IconBracketsContain, IconPlus, IconTrash } from '@tabler/icons-react'
import { uid } from '~/components/rules/ruleBuilder/ruleBuilder'
import { ConditionRow } from '~/components/rules/ruleBuilder/components/conditionRow'
import { useMemo } from 'react'

export function GroupCard({
  groupNode,
  onChange,
  onRemove,
  fields,
  arrayItems,
}: {
  groupNode: GroupNode
  onChange: (g: GroupNode) => void
  onRemove?: () => void
  fields: FieldInfo[]
  arrayItems: Record<string, FieldInfo[]>
}) {
  const addCondition = () => {
    const next: GroupNode = {
      ...groupNode,
      children: [
        ...groupNode.children,
        {
          id: uid(),
          kind: 'condition',
          operator: 'eq',
          field: fields.find((f) => f.type === 'scalar')?.path,
        } as ConditionNode,
      ],
    }
    onChange(next)
  }
  const addGroup = () => {
    const next: GroupNode = {
      ...groupNode,
      children: [...groupNode.children, { id: uid(), kind: 'group', op: 'and', children: [] } as GroupNode],
    }
    onChange(next)
  }
  const removeChild = (id: string) =>
    onChange({ ...groupNode, children: groupNode.children.filter((c) => c.id !== id) })
  const updateChild = (id: string, next: NodeModel) =>
    onChange({ ...groupNode, children: groupNode.children.map((c) => (c.id === id ? next : c)) })

  const borderLeftColor = useMemo(() => {
    return groupNode.op === 'or' ? '2px solid var(--mantine-color-orange-6)' : '2px solid var(--mantine-color-blue-6)'
  }, [groupNode.op])

  return (
    <Card
      withBorder
      radius="xs"
      p="md"
      shadow="xs"
      style={{
        background: 'var(--mantine-color-body)',
        borderLeft: borderLeftColor,
        paddingLeft: rem(12),
        width: '100%',
      }}
    >
      <Group justify="space-between" align="left" mb="xs">
        <Group>
          <Badge variant="light" leftSection={<IconBraces size={14} />}>
            Group
          </Badge>
          <SegmentedControl
            size="sm"
            value={groupNode.op}
            onChange={(v) => onChange({ ...groupNode, op: v as 'and' | 'or' })}
            data={[
              { label: 'AND', value: 'and' },
              { label: 'OR', value: 'or' },
            ]}
          />
        </Group>

        {onRemove && (
          <Tooltip label="Delete group">
            <ActionIcon color="red" variant="light" onClick={onRemove}>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Stack gap="sm">
        {groupNode.children.length === 0 && (
          <Text c="dimmed" size="sm">
            No filters yet. Add a filter or an inner group.
          </Text>
        )}
        {groupNode.children.map((child) =>
          child.kind === 'group' ? (
            <GroupCard
              key={child.id}
              groupNode={child as GroupNode}
              onChange={(gg) => updateChild(child.id, gg)}
              onRemove={() => removeChild(child.id)}
              fields={fields}
              arrayItems={arrayItems}
            />
          ) : (
            <ConditionRow
              key={child.id}
              c={child as ConditionNode}
              onChange={(cc) => updateChild(child.id, cc)}
              onRemove={() => removeChild(child.id)}
              fields={fields}
              arrayItems={arrayItems}
            />
          )
        )}

        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            variant="subtle"
            size="compact-sm"
            onClick={addCondition}
            styles={{ root: { transition: 'all 0.2s ease' } }}
          >
            Add filter
          </Button>
          <Button
            leftSection={<IconBracketsContain size={16} />}
            variant="subtle"
            size="compact-sm"
            onClick={addGroup}
            styles={{ root: { transition: 'all 0.2s ease' } }}
          >
            Add inner group
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
