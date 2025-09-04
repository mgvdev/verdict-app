import type { ApplicationService } from '@adonisjs/core/types'
import db from '@adonisjs/lucid/services/db'

export default class SqliteWalModeProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    await db.rawQuery('PRAGMA journal_mode = WAL;')
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
