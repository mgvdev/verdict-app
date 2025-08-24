import { AuthLayout } from '~/layouts/authLatout'
import { Tabs } from '@mantine/core'
import VerdictStudio from '~/components/rules/ruleBuilder/ruleBuilder'
import { InferPageProps } from '@adonisjs/inertia/types'
import RulesController from '#controllers/rules_controller'
import { useState } from 'react'

function Show(props: InferPageProps<RulesController, 'show'>) {
  const [rule, setRule] = useState(JSON.parse(props.rule.rule))

  return (
    <>
      <Tabs defaultValue="stats">
        <Tabs.List>
          <Tabs.Tab value="stats">Stats</Tabs.Tab>
          <Tabs.Tab value="rules">Rules</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stats">{JSON.stringify(props.rule, null, 2)}</Tabs.Panel>

        <Tabs.Panel value="rules">
          <VerdictStudio rule={rule} onChange={(value) => setRule(value)} />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

Show.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Show
