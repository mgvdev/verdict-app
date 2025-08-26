import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import UUIDModel from '#models/uuid_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ApiKey from '#models/api_key'

export default class ApiLog extends UUIDModel {
  @column()
  declare api_key_id: string

  @belongsTo(() => ApiKey, { foreignKey: 'api_key_id' })
  declare apiKey: BelongsTo<typeof ApiKey>

  @column()
  declare rule_id: string

  @column()
  declare context: object | string

  @column()
  declare result: object | string

  @column.dateTime()
  declare evaluated_at: DateTime
}
