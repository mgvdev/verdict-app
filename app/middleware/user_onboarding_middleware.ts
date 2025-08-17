import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserOnboardingMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!ctx.auth.user) {
      return ctx.response.redirect('/')
    }

    if (!ctx.auth.user.onboarding_status) {
      return ctx.response.redirect('/onboarding')
    }

    return await next()
  }
}
