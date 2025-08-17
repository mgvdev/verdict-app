import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .uuid('current_project_id')
        .nullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('current_project_id')
    })
  }
}
