import factory from '@adonisjs/lucid/factories'
import Rule from '#models/rule'

export const RuleFactory = factory
  .define(Rule, async ({ faker }) => {
    return {}
  })
  .build()