import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

export class ApiUsageService {
  async getUsage(user: User): Promise<number> {
    const logCountOnLast30DaysQuery = db
      .from('api_logs')
      .whereBetween('evaluated_at', [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date(),
      ])
      .whereIn('api_key_id', (query) => {
        query
          .select('id')
          .from('api_keys')
          .whereIn('project_id', (subQuery) => {
            subQuery.select('project_id').from('users_projects').where('user_id', user.id)
          })
      })
      .count('* as count')
      .toQuery()

    /**
     * The knex query builder return 0 so we need to use rawQuery to get the result
     */
    const result = await db.rawQuery(logCountOnLast30DaysQuery)
    console.log(result)

    return result[0]?.count ?? 0
  }
}
