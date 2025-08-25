import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rules'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.json('context').nullable().defaultTo('{}')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('context')
    })
  }
}
