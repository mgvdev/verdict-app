import factory from '@adonisjs/lucid/factories'
import ApiKey from '#models/api_key'

export const ApiKeyFactory = factory
  .define(ApiKey, async ({ faker }) => {
    return {}
  })
  .build()
