import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Flex, Group, Kbd, Stack, Tabs, Text, Textarea, Title } from '@mantine/core'
import { IconCircleCheck, IconCircleX, IconPlayerPlayFilled } from '@tabler/icons-react'

// Verdict imports
import { Engine, RuleSerializer } from '@mgvdev/verdict'
import { GroupNode } from '~/components/rules/ruleBuilder/types'
import {
  extractFieldsFromContext,
  safeJsonParse,
  toNodeGroup,
  toVerdict,
} from '~/components/rules/ruleBuilder/utils'
import { GroupCard } from '~/components/rules/ruleBuilder/components/groupCard'
import  Editor  from '@monaco-editor/react'
import { useQueryState } from 'nuqs'

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
  rule,
  onContextChange,
}: {
  initialContext?: any
  onChange?: (json: any) => void
  rule?: any,
  onContextChange?: (json: string) => void
}) {
  const [contextText, setContextText] = useState<string>(
    initialContext
  )

  const [tabs, setTabs] = useQueryState('builderTabs', {defaultValue: 'build'})

  const contextObj = useMemo(() => safeJsonParse(contextText, {}), [contextText])
  const { fields, arrayItems } = useMemo(() => extractFieldsFromContext(contextObj), [contextObj])

  const EMPTY_GROUP: GroupNode = { id: uid(), kind: 'group', op: 'and', children: [] }

  const [root, setRoot] = useState<GroupNode>(rule ? toNodeGroup(rule) : EMPTY_GROUP)

  const engine = useMemo(() => new Engine(), [])
  const serializer = useMemo(() => new RuleSerializer(), [])

  const verdictObj = useMemo(() => toVerdict(root, fields), [root, fields])
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
      console.log({verdictObj, ctx, serialized})
      const res = verdictObj ? engine.evaluate(serializer.deserialize(serializer.serialize(verdictObj)), ctx) : null
      setTestResult(res)
    } catch (e) {
      setTestResult(null)
    }
  }

  // expose change
  useEffect(() => {
    if (onChange && serialized) onChange(serialized)
  }, [serialized, onChange])

  useEffect(() => {
    if (onContextChange && contextText) onContextChange(contextText)
  }, [contextText, onContextChange])

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

      <Tabs defaultValue="build" value={tabs} onChange={(value) => setTabs(value)}  keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="context">Context</Tabs.Tab>
          <Tabs.Tab value="build">Build</Tabs.Tab>
          <Tabs.Tab value="test">Test</Tabs.Tab>
        </Tabs.List>

        {/* CONTEXT TAB */}
        <Tabs.Panel value="context">
          <Stack gap="md" style={{ flex: 1, minWidth: 500 }}>
            <Card withBorder radius="xs">
              <Text fw={600} mb="xs">
                Context JSON
              </Text>
              <Editor
                height="500px"
                theme="vs-light"
               defaultLanguage="json"
               defaultValue={contextText}
                onChange={(value) => setContextText(value ?? '')}
                onMount={(editor) => {
                  setTimeout(() => {
                    editor.getAction("editor.action.formatDocument").run();
                  }, 100)
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'off',
                  padding: { top: 10 },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  wordWrapColumn: 100,
                }}
              />
              {/*<Textarea*/}
              {/*  minRows={12}*/}
              {/*  autosize*/}
              {/*  value={contextText}*/}
              {/*  onChange={(e) => setContextText(e.currentTarget.value)}*/}
              {/*/>*/}
              <Text c="dimmed" size="xs" mt="xs">
                Fields are auto-detected from this JSON.
              </Text>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Build tabs */}
        <Tabs.Panel value="build" pt="md">
          <Flex direction="column" align="start">
            <Stack gap="md" style={{ flex: 2, width: '100%' }}>
              <GroupCard
                groupNode={root}
                onChange={setRoot}
                fields={fields}
                arrayItems={arrayItems}
              />
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
                <Textarea
                  minRows={16}
                  autosize
                  value={JSON.stringify(verdictObj, null, 2)}
                  readOnly
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
      </Tabs>
    </Stack>
  )
}
