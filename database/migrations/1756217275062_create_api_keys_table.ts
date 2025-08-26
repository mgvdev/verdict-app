import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('created_by').notNullable()
      table.foreign('created_by').references('id').inTable('users')

      table.uuid('project_id').notNullable()
      table.foreign('project_id').references('id').inTable('projects')

      table.string('name').notNullable()
      table.string('key').notNullable()
      table.string('secret').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('last_used_at').nullable()
      table.timestamp('deleted_at').nullable()
    })

    this.schema.table(this.tableName, (table) => {
      table.unique(['project_id', 'name'])
      table.index(['key', 'secret'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
