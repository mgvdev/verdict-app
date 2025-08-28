import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ApiLog from '#models/api_log'
import { DateTime } from 'luxon'

export default class ApiLogMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const triggeredAt = DateTime.now()
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()

    if (ctx.response.getBody().evaluation_result !== undefined) {
      await ApiLog.create({
        api_key_id: ctx.apiClient?.id,
        context: ctx.request.body(),
        result: ctx.response.getBody(),
        rule_id: ctx.request.param('ruleId'),
        evaluated_at: triggeredAt,
      })
    }

    return output
  }
}
