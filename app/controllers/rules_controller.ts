import type { HttpContext } from '@adonisjs/core/http'
import Rule from '#models/rule'

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

  public async create({ inertia }: HttpContext) {
    return inertia.render('rules/create')
  }
}
