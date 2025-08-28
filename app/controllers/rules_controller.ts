import type { HttpContext } from '@adonisjs/core/http'
import Rule from '#models/rule'
import { createRuleValidator, updateRuleValidator } from '#validators/rule'
import { ApiStatService } from '#services/api_stat_service'
import { inject } from '@adonisjs/core'
import RulePolicy from '#policies/rule_policy'
import { NotificationService, NotificationType } from '#services/notification_service'

@inject()
export default class RulesController {
  constructor(private readonly apiStatService: ApiStatService) {}

  public async index({ inertia, auth, request }: HttpContext) {
    const searchQuery = request.input('search')

    const rules = await Rule.findManyBy({
      project_id: auth.user!.currentProject.id,
    })

    return inertia.render('rules/rules', {
      rules: searchQuery ? rules.filter((rule) => rule.name.includes(searchQuery)) : rules,
    })
  }

  public async show({ inertia, params }: HttpContext) {
    const rule = await Rule.findOrFail(params.id)
    return inertia.render('rules/show', {
      rule,
      stats: inertia.defer(async () => {
        return await this.apiStatService.getRuleStats(rule.id)
      }),
    })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('rules/create')
  }

  public async store({ request, inertia, auth }: HttpContext) {
    const body = await request.validateUsing(createRuleValidator)

    const rule = await Rule.create({
      name: body.name,
      rule: body.rule,
      description: body.description ?? '',
      context: JSON.parse(body.context),
      project_id: auth!.user!.currentProject.id,
    })

    return inertia.location(`/rules/${rule.id}`)
  }

  public async update({ request, params, response }: HttpContext) {
    const body = await request.validateUsing(updateRuleValidator)

    const rule = await Rule.findOrFail(params.id)

    for (const key of ['name', 'rule', 'description', 'context']) {
      if (key === 'rule') {
        // @ts-ignore
        rule[key] = JSON.stringify(body[key]) ?? rule[key]
      } else {
        // @ts-ignore
        rule[key] = body[key] ?? rule[key]
      }
    }
    await rule.save()

    return response.redirect().back()
  }

  public async destroy({ params, response, bouncer, session }: HttpContext) {
    const rule = await Rule.find(params.id)

    if (!rule) {
      return response.notFound()
    }

    if (await bouncer.with(RulePolicy).denies('delete', rule)) {
      return response.forbidden()
    }

    session.flash(
      NotificationService.notificationKey,
      NotificationService.success('Rule deleted successfully', 'Done')
    )

    await rule.delete()
    return response.redirect().toRoute('rules.index')
  }
}
