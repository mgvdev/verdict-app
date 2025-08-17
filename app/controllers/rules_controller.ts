import type { HttpContext } from '@adonisjs/core/http'

export default class RulesController {
  public index({ inertia, auth, request }: HttpContext) {
    const searchQuery = request.input('search')

    const rules = [
      {
        id: 1,
        name: 'Rule 1',
        description: 'Description 1',
        validation: { negative: 450, positive: 650 },
      },
      {
        id: 2,
        name: 'Est rentable',
        description: 'Valide si une organisation est rentable',
        validation: { negative: 143, positive: 889 },
      },
    ]

    return inertia.render('rules/rules', {
      rules: searchQuery ? rules.filter((rule) => rule.name.includes(searchQuery)) : rules,
    })
  }
}
