import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Code,
  Flex,
  Group,
  Kbd,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import {
  IconCircleCheck,
  IconCircleX,
  IconJson,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'

// Verdict imports
import { Engine, RuleSerializer, } from '@mgvdev/verdict'
import {
  GroupNode,
} from '~/components/rules/ruleBuilder/types'
import { extractFieldsFromContext, safeJsonParse, toVerdict, } from '~/components/rules/ruleBuilder/utils'
import { GroupCard } from '~/components/rules/ruleBuilder/components/groupCard'

/**
 * ---------------------------------------------------------------------------
 * VerdictStudio – A Mantine-powered rule builder for @mgvdev/verdict
 * ---------------------------------------------------------------------------
 * Features
 *  - Deduce fields from a JSON context (dot-paths, including array paths)
 *  - Build nested AND/OR groups and conditions (eq, ne, gt, gte, lt, lte)
 *  - Membership operators (In, notIn)
 *  - Array operators (any, all, none) with inner condition editor
 *  - Live JSON serialization preview (RuleSerializer)
 *  - Test tab to evaluate the current rule against a JSON payload
 *
 * Usage
 *  <VerdictStudio initialContext={yourJson} onChange={(json) => ...} />
 */
let _id = 0
export const uid = () => `${Date.now().toString(36)}_${(_id++).toString(36)}`


export default function VerdictStudio({
  initialContext,
  onChange,
  rule
}: {
  initialContext?: any
  onChange?: (json: any) => void,
  rule?: any
}) {
  const [contextText, setContextText] = useState<string>(
    JSON.stringify(
      initialContext ?? {
        user: {
          active: true,
          age: 25,
          status: 'active',
          roles: [
            { name: 'user', status: 'active' },
            { name: 'editor', status: 'active' },
          ],
        },
      },
      null,
      2
    )
  )

  const contextObj = useMemo(() => safeJsonParse(contextText, {}), [contextText])
  const { fields, arrayItems } = useMemo(() => extractFieldsFromContext(contextObj), [contextObj])

  const [root, setRoot] = useState<GroupNode>({ id: uid(), kind: 'group', op: 'and', children: [] })

  const engine = useMemo(() => new Engine(), [])
  const serializer = useMemo(() => new RuleSerializer(), [])

  const verdictObj = useMemo(() => toVerdict(root), [root])
  const serialized = useMemo(() => {
    try {
      return verdictObj ? serializer.serialize(verdictObj) : null
    } catch {
      return null
    }
  }, [serializer, verdictObj])

  const [testerJson, setTesterJson] = useState<string>(() => JSON.stringify(contextObj, null, 2))
  const [testResult, setTestResult] = useState<null | boolean>(null)

  const runTest = () => {
    try {
      const ctx = JSON.parse(testerJson || '{}')
      const res = verdictObj ? engine.evaluate(verdictObj, ctx) : null
      setTestResult(res)
    } catch (e) {
      setTestResult(null)
    }
  }

  // expose change
  React.useEffect(() => {
    if (onChange && serialized) onChange(serialized)
  }, [serialized, onChange])

  return (
    <Stack p="md" gap="md">
      <Group align="center" justify="space-between">
        <Group>
          <Title order={3}>Verdict Studio</Title>
        </Group>
        <Group gap="xs">
          <Kbd>AND</Kbd>
          <Text c="dimmed" size="sm">
            /
          </Text>
          <Kbd>OR</Kbd>
          <Text c="dimmed" size="sm">
            toggle in group header
          </Text>
        </Group>
      </Group>

      <Tabs defaultValue="build" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="context">Context</Tabs.Tab>
          <Tabs.Tab value="build">Build</Tabs.Tab>
          <Tabs.Tab value="test">Test</Tabs.Tab>
          <Tabs.Tab value="json">JSON</Tabs.Tab>
        </Tabs.List>

        {/* CONTEXT TAB */}
        <Tabs.Panel value="context">
          <Stack gap="md" style={{ flex: 1, minWidth: 500 }}>
            <Card withBorder radius="xs">
              <Text fw={600} mb="xs">
                Context JSON
              </Text>
              <Textarea
                minRows={12}
                autosize
                value={contextText}
                onChange={(e) => setContextText(e.currentTarget.value)}
              />
              <Text c="dimmed" size="xs" mt="xs">
                Fields are auto-detected from this JSON.
              </Text>
            </Card>

            <Card withBorder radius="xs">
              <Text fw={600} mb="xs">
                Serialized rule
              </Text>
              <Textarea
                readOnly
                minRows={10}
                autosize
                value={
                  serialized
                    ? JSON.stringify(serialized, null, 2)
                    : '// define at least one condition'
                }
              />
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Build tabs */}
        <Tabs.Panel value="build" pt="md">
          <Flex direction="column"  align="start">
            <Stack gap="md" style={{ flex: 2, width: '100%' }}>
              <GroupCard groupNode={root} onChange={setRoot} fields={fields} arrayItems={arrayItems} />
            </Stack>
          </Flex>
        </Tabs.Panel>

        {/* TEST TAB */}
        <Tabs.Panel value="test" pt="md">
          <Group align="start" grow>
            <Stack style={{ flex: 1 }}>
              <Card withBorder radius="xs">
                <Text fw={600} mb="xs">
                  Test context
                </Text>
                <Textarea
                  minRows={16}
                  autosize
                  value={testerJson}
                  onChange={(e) => setTesterJson(e.currentTarget.value)}
                />
                <Group mt="sm">
                  <Button leftSection={<IconPlayerPlayFilled size={16} />} onClick={runTest}>
                    Run
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => setTesterJson(JSON.stringify(contextObj, null, 2))}
                  >
                    Reset from Context
                  </Button>
                </Group>
              </Card>
            </Stack>
            <Stack style={{ minWidth: 320 }}>
              <Card withBorder radius="xs">
                <Text fw={600} mb="xs">
                  Result
                </Text>
                {testResult === null ? (
                  <Text c="dimmed">—</Text>
                ) : testResult ? (
                  <Group>
                    <IconCircleCheck color="var(--mantine-color-green-6)" />
                    <Text fw={600} c="green">
                      true
                    </Text>
                  </Group>
                ) : (
                  <Group>
                    <IconCircleX color="var(--mantine-color-red-6)" />
                    <Text fw={600} c="red">
                      false
                    </Text>
                  </Group>
                )}
              </Card>
            </Stack>
          </Group>
        </Tabs.Panel>

        {/* JSON TAB */}
        <Tabs.Panel value="json" pt="md">
          <Group align="start" grow>
            <Card withBorder radius="xs" style={{ flex: 1 }}>
              <Text fw={600} mb="xs">
                Serialized Rule (read-only)
              </Text>
              <Textarea
                readOnly
                minRows={24}
                autosize
                value={serialized ? JSON.stringify(serialized, null, 2) : '// no rule yet'}
              />
            </Card>
          </Group>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
