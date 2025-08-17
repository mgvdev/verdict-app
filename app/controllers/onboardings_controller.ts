import type { HttpContext } from '@adonisjs/core/http'
import { createProjectValidator } from '#validators/project'
import Project from '#models/project'

export default class OnboardingsController {
  public async showOnboarding({ inertia }: HttpContext) {
    return inertia.render('onboarding/onboarding')
  }

  /**
   * Create a new project and attach it to the user as
   * the current project
   *
   * @param inertia
   * @param auth
   * @param request
   */
  public async submitOnboarding({ inertia, auth, request }: HttpContext) {
    const payload = await request.validateUsing(createProjectValidator)

    const user = auth.use('web').user!

    const project = await Project.create({
      name: payload.name,
      description: payload.description ?? undefined,
    })

    await user.related('projects').attach([project.id])

    /**
     * Assign the project to the user for the default project
     */
    await user.related('currentProject').associate(project)

    /**
     * Validate the user onboarding
     */
    user.onboarding_status = true
    await user.save()

    return inertia.location('/')
  }
}
