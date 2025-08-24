import { AuthLayout } from '~/layouts/authLatout'
import { ReactNode, useEffect, useState } from 'react'
import VerdictStudio from '~/components/rules/ruleBuilder/ruleBuilder'
import { Button, Card, Group, Text, TextInput } from '@mantine/core'
import { router, useForm } from '@inertiajs/react'

function Create() {
  const [rule, setRule] = useState({})

  const form = useForm({
    rule: {},
    name: '',
    description: '',
  })

  const saveRule = () => {
    form.setData('rule', rule)
    form.post('/rules')
  }

  useEffect(() => {
    form.setData('rule', rule)
  }, [rule])

  return (
    <div>
      <Card withBorder>
        <Group justify="space-between" align="center">
          <Group w={'70%'}>
            <TextInput
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              withAsterisk
              placeholder="Rule name"
              error={form.errors?.name}
              w={'100%'}
            />
          </Group>
          <Group>
            <Button color="blue" onClick={saveRule}>
              Save
            </Button>
            <Text size={'xs'} c={'gray'}>
              Last save at{' '}
            </Text>
          </Group>
        </Group>
      </Card>
      <VerdictStudio onChange={(value) => setRule(value)} />
    </div>
  )
}

Create.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Create
