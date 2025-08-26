import { DateTime } from 'luxon'
import { beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import UUIDModel from '#models/uuid_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { randomBytes } from 'node:crypto'

export default class ApiKey extends UUIDModel {
  @column()
  declare name: string

  @column({ columnName: 'key' })
  declare apiKey: string

  @column()
  declare secret: string

  @column()
  declare project_id: string

  @belongsTo(() => Project, { localKey: 'id', foreignKey: 'project_id' })
  declare project: BelongsTo<typeof Project>

  @column()
  declare created_by: string

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'created_by' })
  declare createdBy: BelongsTo<typeof User>

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  declare deletedAt: DateTime | null

  @beforeSave()
  static async hashSecret(apiKey: ApiKey) {
    if (apiKey.$dirty.secret) {
      apiKey.secret = await hash.make(apiKey.secret)
    }
  }

  static async generateKey() {
    return `ak_${randomBytes(24).toString('hex')}`
  }

  static async generateSecret() {
    return `sk_${randomBytes(32).toString('hex')}`
  }
}
