import { AuthLayout } from '~/layouts/authLatout'
import { RulesTable } from '~/components/rules/rulesTable/rulesTable'
import { Button, Flex, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { ReactNode, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import { parseAsString, useQueryState } from 'nuqs'
import { IconSearch } from '@tabler/icons-react'
import { InferPageProps } from '@adonisjs/inertia/types'
import RulesController from '#controllers/rules_controller'

function Rules(props: InferPageProps<RulesController, 'index'>) {

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

  const [debounced] = useDebouncedValue(search, 300)

  useEffect(() => {
    router.get(
      '/rules',
      { search: debounced || undefined },
      {
        replace: true,
        preserveState: true,
        preserveScroll: true,
        only: ['rules'],
      }
    )
  }, [debounced])

  const toNewRules = () => {
    router.visit('/rules/create')
  }

  return (
    <>
      <div>
        <Flex>
          <TextInput
            flex={1}
            radius="md"
            placeholder="Search"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && router.get('/rules', { search })}
          />

          <Button ml="lg" maw={200} variant="filled" onClick={toNewRules}>
            Create new rule
          </Button>
        </Flex>
        <RulesTable rules={props.rules} />
      </div>
    </>
  )
}

Rules.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Rules
