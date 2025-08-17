import { AuthLayout } from '~/layouts/authLatout'
import { RulesTable } from '~/components/rules/rulesTable/rulesTable'
import { TextInput } from '@mantine/core'
import { useDebouncedValue} from '@mantine/hooks'
import { useEffect} from 'react'
import { router } from '@inertiajs/react'
import { parseAsString, useQueryState } from 'nuqs'
import { IconSearch } from '@tabler/icons-react'
import { InferPageProps } from '@adonisjs/inertia/types'
import RulesController from '#controllers/rules_controller'

type RulesPageProps = {
  rules: InferPageProps<RulesController, 'index'>['rules']
}

export default function Rules(props: InferPageProps<RulesController, 'index'>) {

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )

  const [debounced] = useDebouncedValue(search, 300)

  useEffect(() => {
    router.get('/rules', { search: debounced || undefined }, {
      replace: true,
      preserveState: true,
      preserveScroll: true,
      only: ['rules'],
    })
  }, [debounced])

  return <AuthLayout>
      <div>
        <TextInput
          radius='md'
          placeholder="Search"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && router.get('/rules', { search })}
        />
        <RulesTable rules={props.rules} />
      </div>
  </AuthLayout>

}
