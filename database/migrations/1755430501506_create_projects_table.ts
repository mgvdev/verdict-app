import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'
  protected tableUsersProjects = 'users_projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.tableUsersProjects, (table) => {
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableUsersProjects)
    this.schema.dropTable(this.tableName)
  }
}
