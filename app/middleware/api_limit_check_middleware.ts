import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ApiUsageService } from '#services/api_usage_service'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

@inject()
/**
 * ApiLimitCheckMiddleware enforces API rate limits based on user subscription tiers.
 * It checks the user's API usage against their subscription plan's limits and returns
 * a 429 status code if the limit is exceeded.
 */
export default class ApiLimitCheckMiddleware {
  constructor(private readonly apiUsageService: ApiUsageService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */

    if (ctx.apiClient) {
      /**
       * Retrieve the user's project association to determine their subscription
       * access. This links the API key to the user's project configuration.
       */
      const userProjects = await db
        .from('users_projects')
        .where('project_id', ctx.apiClient.project_id)
        .first()

      /**
       * Fetch the user associated with the project to check their subscription status.
       */
      const user = await User.query().where('id', userProjects.user_id).first()

      if (user) {
        /**
         * Retrieve the user's subscription details to determine their API usage limits.
         */
        const subscription = await user.subscription()

        /**
         * Get the user's API usage count for the last 30 days. This is calculated
         * by querying the API logs associated with their project and API keys.
         */
        const logCountOnLast30DaysQuery = await this.apiUsageService.getUsage(user)

        /**
         * Apply rate limiting based on subscription tier:
         * - Premium subscribers get 2,000,000 requests/month
         * - Free users get 200,000 requests/month
         */
        if (subscription) {
          if (logCountOnLast30DaysQuery > 2_000_000) {
            return ctx.response.status(429).send({
              message: 'You have exceeded your API limit',
            })
          }
        } else {
          if (logCountOnLast30DaysQuery > 200_000) {
            return ctx.response.status(429).send({
              message: 'You have exceeded your API limit',
            })
          }
        }
      }
    }

    return await next()
  }
}
