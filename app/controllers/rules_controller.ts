import type { HttpContext } from '@adonisjs/core/http'
import Rule from '#models/rule'
import { createRuleValidator, updateRuleValidator } from '#validators/rule'
import { dd } from '@adonisjs/core/services/dumper'

export default class RulesController {
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
      project_id: auth!.user!.currentProject.id,
    })

    return inertia.location(`/rules/${rule.id}`)
  }

  public async update({ request, inertia, params, session, response }: HttpContext) {
    const body = await request.validateUsing(updateRuleValidator)

    const rule = await Rule.findOrFail(params.id)

    for (const key of ['name', 'rule', 'description']) {
      if (key === 'rule') {
        // @ts-ignore
        rule[key] = JSON.stringify(body[key]) ?? rule[key]
      } else {
        // @ts-ignore
        rule[key] = body[key] ?? rule[key]
      }
    }
    await rule.save()

    session.flash('flash', {
      message: 'Rule updated successfully',
      type: 'success',
    })

    return response.redirect().back()
  }
}
