import ApiLog from '#models/api_log'
import { Anchor, Button, Drawer, Group, Table, Text } from '@mantine/core'
import { Link } from '@inertiajs/react'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import Editor from '@monaco-editor/react'
import React from 'react'

type ActivityTableProps = {
  apiLogs: Partial<ApiLog>[]
}

export function ActivityTable(props: ActivityTableProps) {

  const [opened, { open, close }] = useDisclosure(false);
  const [currentActivity, setCurrentActivity] = React.useState<Partial<ApiLog> | null>(null);

  const openContextDrawer = (activity: Partial<ApiLog>) => {
    setCurrentActivity(activity);
    open();
  }

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Context" position={'right'}>
        <Editor
          height="90vh"
          theme="vs-light"
          defaultLanguage="json"
          defaultValue={JSON.stringify(JSON.parse((currentActivity?.context ?? '{}') as string), null, 2) as unknown as string}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'off',
            padding: { top: 10 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wordWrapColumn: 100,
          }}
        />
      </Drawer>
      <Table>

        <Table.Thead>
          <Table.Tr>
             <Table.Th>Rule name</Table.Th>
             <Table.Th>Api key name</Table.Th>
             <Table.Th>Evaluated at</Table.Th>
             <Table.Th>Result</Table.Th>
             <Table.Th>Actions</Table.Th>
           </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {
            props.apiLogs.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} onOpenContext={openContextDrawer} />
            ))
          }
        </Table.Tbody>

      </Table>
    </>
  )
}

type ActivityListItemProps = {
  activity: Partial<ApiLog>,
  onOpenContext: (activity: Partial<ApiLog>) => void,
}

function ActivityListItem({ activity, onOpenContext }: ActivityListItemProps) {
  const evaluatedAtString = new Date(activity.evaluatedAt as unknown as string).toLocaleString()
  const result = JSON.parse(activity.result as unknown as string)

  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Anchor>
            <Link href={`/rules/${activity.rule?.id}`}>{activity.rule?.name}</Link>
          </Anchor>
        </Table.Td>
        <Table.Td>{activity.apiKey?.name}</Table.Td>
        <Table.Td>{evaluatedAtString}</Table.Td>
        <Table.Td>
          {result.evaluation_result === null ? (
            <Text c="dimmed">—</Text>
          ) : result.evaluation_result ? (
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
        </Table.Td>
        <Table.Td>
          <Group gap={'md'}>
            <Button color={'blue'} variant={'subtle'} onClick={() => onOpenContext(activity)}>
              See context
            </Button>
            <Button color={'blue'}>See details</Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    </>
  )
}

