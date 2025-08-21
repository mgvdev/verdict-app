import { AuthLayout } from '~/layouts/authLatout'
import { ReactNode } from 'react'
import VerdictStudio from '~/components/rules/ruleBuilder/ruleBuilder'


function Create() {

  return (
    <div>
      <VerdictStudio/>
    </div>
  )

}

Create.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Create
