import { DateTime } from 'luxon'
import { column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import UUIDModel from '#models/uuid_model'

export default class Rule extends UUIDModel {
  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare rule: object | string

  /**
   * Context is the data that will be used to evaluate the rule
   * use only on the builder ui to test the rule
   *
   * this column is not used in the rule evaluation
   */
  @column()
  declare context: object

  @column()
  declare project_id: string

  @hasOne(() => Project, { foreignKey: 'project_id' })
  declare project: HasOne<typeof Project>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
