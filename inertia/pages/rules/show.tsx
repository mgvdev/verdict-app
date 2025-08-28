import { AuthLayout } from '~/layouts/authLatout'
import { Box, Button, Flex, Paper, Space, Tabs, TextInput, Text, Group } from '@mantine/core'
import VerdictStudio from '~/components/rules/ruleBuilder/ruleBuilder'
import { InferPageProps } from '@adonisjs/inertia/types'
import RulesController from '#controllers/rules_controller'
import { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'
import { router, useForm } from '@inertiajs/react'
import { notifications } from '@mantine/notifications';
import { StatsRing } from '~/components/rules/ruleStats/ruleStats'
import Rule from '#models/rule'
import { GetRuleStatsResponse } from '#services/api_stat_service'

type pageProps = {
  rule: Rule
  stats: GetRuleStatsResponse
}

function Show(props: pageProps & InferPageProps<RulesController, 'show'>) {

  const [rule, setRule] = useState(JSON.parse(props.rule.rule as string))
  const [context, setContext] = useState(props.rule.context)

  const [tabs, setTabs] = useQueryState('tabs', {defaultValue: 'stats'})

  const form = useForm({
    name: props.rule.name,
    description: props.rule.description,
    rule: rule,
    context: context
  })

  const saveRule = () => {

    // @ts-ignore
    form.setData('rule', rule)
    form.patch(`/rules/${props.rule.id}`, {preserveUrl: true, onSuccess: () => {
      notifications.show({
        title: 'Rule saved',
        message: 'Rule saved successfully',
        color: 'green',
      });
    }
    })
  }

  useEffect(() => {
    form.setData('rule', rule)
  }, [rule])

  useEffect(() => {
    form.setData('context', context)
  }, [context])

  return (
    <>

        <Flex direction="row" mt={'md'} justify={'start'} gap="md">
          <TextInput
            label="Name"
            placeholder="Enter rule name"
            value={form.data.name}
            // @ts-ignore
            onChange={(e) => form.setData('name', e.target.value)}
            error={form.errors?.name}
          />
          <TextInput
            label="Description"
            placeholder="Enter rule description"
            value={form.data.description}
            // @ts-ignore
            onChange={(e) => form.setData('description', e.target.value)}
            error={form.errors?.description}
          />
          <Button onClick={saveRule} style={{marginTop: 'auto'}}>Save</Button>
        </Flex>
      <Space mb={'xl'}/>
      <Tabs defaultValue="stats" value={tabs} onChange={(value) => setTabs(value)}>
        <Tabs.List>
          <Tabs.Tab value="stats">Stats</Tabs.Tab>
          <Tabs.Tab value="rules">Rules</Tabs.Tab>
          <Tabs.Tab value="configurations">Configurations</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stats" p={'xl'}>
          { props.stats ? <StatsRing ruleStats={props.stats} loading={false} /> : <StatsRing loading={true}/> }

        </Tabs.Panel>

        <Tabs.Panel value="rules">
          <VerdictStudio
            rule={rule}
            initialContext={context}
            onChange={(value) => setRule(value)}
            onContextChange={(value) => setContext(value)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="configurations">

          <Box pt={'xl'}>
             <Paper p={'xl'} shadow={'xs'}>
                  <Flex justify={'space-between'}>
                    <Flex direction={'column'}>
                      <Text size={'lg'}>Delete rule ?</Text>
                      <Text c={'red'}>This action is permanent</Text>
                    </Flex>
                    <Button color={'red'} mt={'md'} onClick={() => router.delete(`/rules/${props.rule.id}`)}>Delete</Button>
                  </Flex>
             </Paper>
          </Box>

        </Tabs.Panel>
      </Tabs>
    </>
  )
}

Show.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Show
