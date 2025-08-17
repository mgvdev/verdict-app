import { Anchor, Group, Progress, Table, Text } from '@mantine/core'

import classes from './ruleTableListItem.module.css'

export function RulesTable({ rules }: { rules: { id: number; name: string; description: string; validation: { negative: number; positive: number }}[] }) {

  return (
    <Table verticalSpacing="xs">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th
             w={500}
          >Validation</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rules.map((row) => (
          <RuleListItem key={row.id} {...row} />
        ))}
      </Table.Tbody>
    </Table>
  )
}


function RuleListItem(row: { id: number; name: string; description: string; validation: { negative: number; positive: number }}) {
    const totalReviews = row.validation.negative + row.validation.positive;
    const positiveValidation = (row.validation.positive / totalReviews) * 100;
    const negativeValidation = (row.validation.negative / totalReviews) * 100;

    return (
      <Table.Tr key={row.name}>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {row.name}
          </Anchor>
        </Table.Td>
        <Table.Td>{row.description}</Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text fz="xs" c="teal" fw={700}>
              {positiveValidation.toFixed(0)}%
            </Text>
            <Text fz="xs" c="red" fw={700}>
              {negativeValidation.toFixed(0)}%
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              className={classes.progressSection}
              value={positiveValidation}
              color="teal"
            />
            <Progress.Section
              className={classes.progressSection}
              value={negativeValidation}
              color="red"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );

}
