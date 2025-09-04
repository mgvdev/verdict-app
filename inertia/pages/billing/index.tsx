import { AuthLayout } from '~/layouts/authLatout'
import { Anchor, Card, Flex, Space, Text } from '@mantine/core'
import PricingCard from '~/components/billing/pricingCard/pricingCard'
import { ApiUsageCard } from '~/components/billing/usageCard/apiUsageCard'

export type BillingProps = {
  isSubscribed: boolean
  plan: {
    amount: string
    currency: string
    interval: string
  }
  billingPortalUrl: string,
  currentCall: number
}

function Billing(props: BillingProps) {
  const formatedAmount = props.plan?.amount
    ? Intl.NumberFormat('en-US', {
        currency: props.plan.currency ?? 'USD',
        style: 'currency',
        currencyDisplay: 'symbol',
      }).format(Number(props.plan.amount) / 100)
    : 'Free'


  return (
    <>
      <Text size={'xl'}>Billing</Text>
      <Space mb={'xl'} />
      <ApiUsageCard maximumCall={200000} currentCall={props.currentCall ?? 0}/>

      <Space mb={'xl'} />

      {!props.isSubscribed && (
        <PricingCard/>
      )}

      {
        props.isSubscribed && props.billingPortalUrl && (
          <Card withBorder={true} radius={'md'} p={'xl'}>
            <Card.Section>
              <Text size={'lg'}>Plan</Text>
              <Text size={'sm'}>
                {formatedAmount} / {props.plan.interval}
              </Text>

              <Anchor href={props.billingPortalUrl}>Go to subscription management</Anchor>
            </Card.Section>
          </Card>
        )
      }
    </>
  )
}

Billing.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>

export default Billing
