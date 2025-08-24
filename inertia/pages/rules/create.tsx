import { AuthLayout } from '~/layouts/authLatout'
import { ReactNode, useState } from 'react'
import VerdictStudio from '~/components/rules/ruleBuilder/ruleBuilder'
import { Button, Card, Group, Text, TextInput } from '@mantine/core'

function Create() {
  const [rules, setRules] = useState({})
  const [name, setName] = useState('')

  return (
    <div>
      <Card withBorder>
        <Group justify="space-between" align="center">
          <Group w={'70%'}>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              withAsterisk
              placeholder="Rule name"
              w={'100%'}
            />
          </Group>
          <Group>
            <Button color="blue">Save</Button>
            <Text size={'xs'} c={'gray'}>Last save at </Text>
          </Group>
        </Group>
      </Card>
      <VerdictStudio onChange={(value) => setRules(value)} />
    </div>
  )
}

Create.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Create
