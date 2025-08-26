import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('api_key_id').notNullable()
      table.foreign('api_key_id').references('id').inTable('api_keys')

      table.uuid('rule_id')
      table.foreign('rule_id').references('id').inTable('rules')

      table.json('context').notNullable().defaultTo('{}')
      table.json('result').notNullable().defaultTo('{}')

      table.timestamp('evaluated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
