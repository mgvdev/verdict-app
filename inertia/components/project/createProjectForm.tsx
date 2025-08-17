import { useForm } from '@inertiajs/react'
import { Button, Paper, Stack, TextInput, Text } from '@mantine/core'

export type CreateProjectFormProps = {
  type: 'onboarding' | 'project'
}

export function CreateProjectForm(props: CreateProjectFormProps) {

  const form = useForm({
    name: '',
    description: ''
  })

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (props.type === 'onboarding') {
      form.post('/onboarding')
    } else {
    form.post('/projects')
    }
  }

  return (
    <>
      <Paper radius="md" p="lg" withBorder w={400}>
        <Text size="lg" p="lg">
          Create a new project
        </Text>

        {props.type === 'onboarding' && (
          <Text size="xs" color="dimmed" p="lg">
            You must create a project to start using Verdict, you can create as many as you want
          </Text>
          )}

        <form onSubmit={submit}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Project name"
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              ></TextInput>
            <TextInput
              label="Description"
              placeholder="Project description"
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
            />
            <Button loading={form.processing} type="submit">Create Project</Button>
          </Stack>
        </form>
      </Paper>
    </>
  )
}
