import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaProjectMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Share the current project context
     */
    const currentProject = await ctx?.auth?.user?.related('currentProject').query().first()

    if (currentProject) {
      ctx.inertia.share({
        currentProject: {
          id: currentProject.id,
          name: currentProject.name,
          description: currentProject.description,
        },
      })
    } else {
      throw new Error('Current project not found')
    }
    return await next()
  }
}
