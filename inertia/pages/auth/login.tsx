import { GuestLayout } from '~/layouts/guestLayout'
import { LoginForm } from '~/components/authentication/loginForm/loginForm'

export default function Login() {
  return (
    <GuestLayout>
      <div className="container">
          <LoginForm />
      </div>
    </GuestLayout>
  )
}
