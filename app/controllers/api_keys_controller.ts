import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'
import { createApiKeyValidator } from '#validators/api_key'
import { inject } from '@adonisjs/core'
import { ApiKeyService } from '#services/api_key_service'

@inject()
export default class ApiKeysController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  public async index({ auth, inertia }: HttpContext) {
    const currentProjectId = auth.user?.current_project_id

    return inertia.render('apiKeys/index', {
      apiKeys: await ApiKey.query()
        .select(['id', 'name', 'key', 'created_at', 'deleted_at', 'created_by', 'project_id'])
        .where('project_id', currentProjectId!)
        .preload('project')
        .preload('createdBy'),
    })
  }

  public async store({ auth, request, session, response }: HttpContext) {
    const projectId = auth.user!.current_project_id

    const body = await request.validateUsing(createApiKeyValidator, {
      meta: { projectId },
    })

    const apikey = await this.apiKeyService.createApiKey(projectId, {
      name: body.name,
      createdBy: auth.user!.id,
    })

    session.flash('apikey', apikey)
    return response.redirect().back()
  }
}
