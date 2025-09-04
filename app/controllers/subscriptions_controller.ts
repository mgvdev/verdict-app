import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import env from '#start/env'
import { NotificationService } from '#services/notification_service'

export default class SubscriptionsController {
  async subscribe({ auth, response, request }: HttpContext) {
    const periodicity = request.input('p') ?? 'monthly'

    const priceId =
      periodicity === 'monthly'
        ? env.get('STRIPE_PREMIUM_MONTHLY')
        : env.get('STRIPE_PREMIUM_ANNUALLY')

    const checkout = await auth.user!.newSubscription(`prod_SxpZxBF1q3l8S6`, priceId).checkout({
      success_url: router.builder().prefixUrl(env.get('APP_URL')).make('billing.checkout_success'),
      cancel_url: router.builder().prefixUrl(env.get('APP_URL')).make('billing.checkout_cancel'),
    })

    return response
      .redirect()
      .status(303)
      .toPath(checkout.asStripeSession().url as string)
  }

  async success({ response, session }: HttpContext) {
    session.flash(
      NotificationService.notificationKey,
      NotificationService.success(
        'Your change can take few minutes to be reflected.',
        'Your subscription has been successfully activated.'
      )
    )

    return response.redirect().toRoute('billing.index')
  }

  async cancel({ response, session }: HttpContext) {
    session.flash(
      NotificationService.notificationKey,
      NotificationService.error('Your subscription could not be validated.', 'Error')
    )

    return response.redirect().toRoute('billing.index')
  }
}
