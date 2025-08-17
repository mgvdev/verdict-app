import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import UUIDModel from '#models/uuid_model'

export default class Project extends UUIDModel {
  @column()
  declare name: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
