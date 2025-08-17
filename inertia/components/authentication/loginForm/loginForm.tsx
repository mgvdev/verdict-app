import { router, useForm, usePage } from '@inertiajs/react'
import { Anchor, Button, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core'

export function LoginForm() {
  const form = useForm({
    email: '',
    password: '',
  })

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('login', {
      onError: () => {
        form.reset('password')
      },
    })
  }

  const { errors } = usePage().props

  return (
    <>
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" p="lg">
          Welcome to Verdict app
        </Text>

        {errors?.message && <Text color="red">{errors.message}</Text>}

        <form onSubmit={submitForm}>
          <Stack>
            <TextInput
              label="Email"
              type="email"
              value={form.data.email}
              onChange={(event) => form.setData('email', event.target.value)}
              radius="md"
            />
            <PasswordInput
              label="Password"
              type="password"
              value={form.data.password}
              onChange={(event) => form.setData('password', event.target.value)}
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              size="xs"
              color="dimmed"
              onClick={() => {
                router.visit('/register')
              }}
            >
              You dont' have an account ? Register
            </Anchor>

            <Button type="submit" radius="xl">
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  )
}
