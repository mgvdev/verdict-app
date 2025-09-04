import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ApiUsageService } from '#services/api_usage_service'

@inject()
export default class BillingsController {
  constructor(private readonly apiUsageService: ApiUsageService) {}

  async index({ auth, inertia }: HttpContext) {
    const subscription = await auth.user!.subscription()

    let plan = null

    if (subscription) {
      const info = await auth.user!.stripe.subscriptions.retrieve(subscription.stripeId)
      /**
       *  plan: Object {
       *     id: 'price_1S1tuZLMHsGfXhxYZ8jfHx41',
       *     object: 'plan',
       *     active: true,
       *     aggregate_usage: null,
       *     amount: 1999,
       *     amount_decimal: '1999',
       *     billing_scheme: 'per_unit',
       *     created: 1756580043,
       *     currency: 'eur',
       *     interval: 'month',
       *     interval_count: 1,
       *     livemode: false,
       *     metadata: Object {
       *     },
       *     meter: null,
       *     nickname: null,
       *     product: 'prod_SxpZxBF1q3l8S6',
       *     tiers_mode: null,
       *     transform_usage: null,
       *     trial_period_days: null,
       *     usage_type: 'licensed',
       *   },
       */
      //@ts-expect-error
      plan = info.plan
    }

    let billingPortalObject = null

    if (auth.user!.stripeId) {
      billingPortalObject = await auth.user!.stripe.billingPortal.sessions.create({
        customer: auth.user!.stripeId as string,
      })
    }

    const pageProps = {
      billingPortalUrl: billingPortalObject?.url ?? null,
      isSubscribed: await auth.user!.subscribed(),
      plan,
      currentCall: inertia.defer(() => this.apiUsageService.getUsage(auth.user!)),
    }

    return inertia.render('billing/index', pageProps)
  }
}
