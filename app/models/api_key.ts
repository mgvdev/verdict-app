import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import UUIDModel from '#models/uuid_model'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import User from '#models/user'

export default class ApiKey extends UUIDModel {
  @column()
  declare name: string

  @column()
  declare api_key: string

  @column()
  declare project_id: string
  @hasOne(() => Project, { foreignKey: 'project_id' })
  declare project: HasOne<typeof Project>

  @column()
  declare created_by: string
  @hasOne(() => User, { foreignKey: 'created_by' })
  declare createdBy: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  declare deletedAt: DateTime | null
}
