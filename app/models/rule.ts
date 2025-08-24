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
  declare rule: object

  @column()
  declare project_id: string

  @hasOne(() => Project, { foreignKey: 'project_id' })
  declare project: HasOne<typeof Project>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
