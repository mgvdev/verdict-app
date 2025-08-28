// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import ApiLog from '#models/api_log'
import ApiKey from '#models/api_key'
import { DateTime } from 'luxon'

export default class ActivitiesController {
  public async index({ auth, inertia, request }: HttpContext) {
    const queryString = request.qs()

    const days = queryString.days ?? 30

    const apiLog = await ApiLog.query()
      .whereIn('api_key_id', (builder) => {
        return builder
          .select('id')
          .from('api_keys')
          .where('project_id', auth.user!.current_project_id)
      })
      .where('evaluated_at', '>', DateTime.now().minus({ days }).toSQL())
      .orderBy('evaluated_at', 'desc')
      .preload('apiKey')
      .preload('rule')
      .limit(1000)

    return inertia.render('activities/index', {
      apiLog,
    })
  }
}
