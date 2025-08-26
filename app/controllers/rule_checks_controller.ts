import type { HttpContext } from '@adonisjs/core/http'
import Rule from '#models/rule'
import { inject } from '@adonisjs/core'
import { VerdictService } from '#services/verdict_service'

@inject()
export default class RuleChecksController {
  constructor(public readonly verdictService: VerdictService) {}

  public async checkRule({ request, response, apiClient }: HttpContext) {
    const evaluationStartedAt = new Date()
    const verbose = request.input('verbose')

    const { ruleId } = request.params()
    const body = request.body()

    const rule = await Rule.query()
      .where('id', ruleId)
      .where('project_id', apiClient!.project_id)
      .first()

    if (!rule) {
      return response.status(404).json({
        message: 'Rule not found',
      })
    }

    const result = this.verdictService.evaluateRule(rule, body)
    const evaluationEndedAt = new Date()

    return response.json({
      evaluation_result: result,
      rule_name: rule.name,
      ...(verbose && {
        evaluation_time: `${evaluationEndedAt.getTime() - evaluationStartedAt.getTime()} ms`,
      }),
    })
  }
}
