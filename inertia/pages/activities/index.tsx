import { AuthLayout } from '~/layouts/authLatout'
import ApiLog from '#models/api_log'
import { ActivityTable } from '~/components/activities/activityTable/activityTable'
import { useQueryState } from 'nuqs'
import { SegmentedControl, Space } from '@mantine/core'
import { useEffect } from 'react'
import { router } from '@inertiajs/react'

type pageProps = {
  apiLog: Partial<ApiLog>[]
}

function Index(props: pageProps) {

  const [days, setDays] = useQueryState('days', {defaultValue: '30'})

  useEffect(() => {
    router
    .get('/activities', {days: days}, {
      replace: true,
      preserveState: true,
      preserveScroll: true,
      only: ['apiLog'],
    })
  }, [days])


  return (
    <>
      <div>
        <SegmentedControl data={[
          {label: '24 hours', value: '1'},
          {label: '7 days', value: '7'},
          {label: '30 days', value: '30'},
          {label: '60 days', value: '60'},
          {label: '90 days', value: '90'}
        ]} value={days} onChange={setDays} />
        <Space mb={'md'}/>
        <ActivityTable apiLogs={props.apiLog}/>
      </div>
    </>
  )

}

Index.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Index
