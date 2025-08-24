import { GuestLayout } from '~/layouts/guestLayout'
import { RegisterForm } from '~/components/authentication/registerForm/registerForm'

export default function Register() {
  return (
    <GuestLayout>
      <div className="container">
        <RegisterForm />
      </div>
    </GuestLayout>
  )
}
