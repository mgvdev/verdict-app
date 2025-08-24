import { useForm, usePage, router } from '@inertiajs/react'
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'

export function RegisterForm() {
  const form = useForm({
    email: '',
    password: '',
    password_confirmation: '',
    accept_terms: 0,
  })

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/register')
  }

  const redirectToLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.get('/login')
  }

  const { errors } = usePage().props

  return (
    <>
      <Paper radius="md" p="lg" withBorder w={400}>
        <Text size="lg" p="lg">
          Register to Verdict
        </Text>

        <form onSubmit={submit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Your email"
              required
              value={form.data.email}
              onChange={(e) => form.setData('email', e.target.value)}
              error={errors?.email}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
              error={errors?.password}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Your password"
              required
              value={form.data.password_confirmation}
              onChange={(e) => form.setData('password_confirmation', e.target.value)}
              error={errors?.password_confirmation}
            />
            <Checkbox
              label="I accept terms and conditions"
              value={form.data.accept_terms}
              onChange={(e) => form.setData('accept_terms', e.target.checked ? 1 : 0)}
              error={errors?.accept_terms}
            />
            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                size="xs"
                color="dimmed"
                onClick={redirectToLogin}
              >
                Already have an account? Login
              </Anchor>

              <Button type="submit">Register</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  )
}
