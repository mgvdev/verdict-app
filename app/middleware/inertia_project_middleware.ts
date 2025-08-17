import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaProjectMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */

    ctx.inertia.share({
      currentProject: {
        id: '0198b85b-ac57-74db-bdaf-e4b41b6e05e3',
        name: 'Gen one of the dead',
        description: 'Environment de test',
      },
    })

    return await next()
  }
}
