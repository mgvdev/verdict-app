import { GuestLayout } from '~/layouts/guestLayout'
import { CreateProjectForm } from '~/components/project/createProjectForm'

export default function Onboarding() {
  return (
    <GuestLayout>
      <div className="container">
        <CreateProjectForm type="onboarding" />
      </div>
    </GuestLayout>
  )
}
