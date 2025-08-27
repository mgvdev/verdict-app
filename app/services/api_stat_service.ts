import db from '@adonisjs/lucid/services/db'
import dbConfig from '#config/database'
import { dd } from '@adonisjs/core/services/dumper'

export type GetRuleStatsResponse = {
  rule_id: string
  total_count: number
  true_count: number
  false_count: number
  period_days: number
}

export class ApiStatService {
  public async getRuleStats(ruleId: string, days = 7): Promise<GetRuleStatsResponse> {
    const isSQLite = dbConfig.connection === 'sqlite'

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = db
      .from('api_logs')
      .select('rule_id')
      .where('rule_id', ruleId)
      .where('evaluated_at', '>=', startDate)
      .groupBy('rule_id')

    if (isSQLite) {
      // Version SQLite
      query = query.select(
        db.raw(
          `SUM(CASE WHEN json_extract(result, '$.evaluation_result') = true THEN 1 ELSE 0 END) as true_count `
        ),
        db.raw(
          `SUM(CASE WHEN json_extract(result, '$.evaluation_result') = false THEN 1 ELSE 0 END) as false_count `
        )
      )
    } else {
      // Version PostgreSQL
      query = query.select(
        db.raw(
          `COUNT(*) FILTER (WHERE (result->>'evaluation_result')::boolean = true) as true_count`
        ),
        db.raw(
          `COUNT(*) FILTER (WHERE (result->>'evaluation_result')::boolean = false) as false_count`
        )
      )
    }

    const result = await query.first()

    if (!result) {
      return {
        rule_id: ruleId,
        total_count: 0,
        true_count: 0,
        false_count: 0,
        period_days: days,
      }
    }
    return {
      rule_id: ruleId,
      total_count: result.true_count + result.false_count,
      true_count: result.true_count,
      false_count: result.false_count,
      period_days: days,
    }
  }
}
