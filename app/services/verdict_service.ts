import { Engine, RuleJson, RuleSerializer } from '@mgvdev/verdict'
import Rule from '#models/rule'

export class VerdictService {
  /**
   * Evaluate a rule against a context
   * @param rule
   * @param context
   */
  evaluateRule(rule: Rule, context: object) {
    const engine = new Engine()
    const serializer = new RuleSerializer()
    const deserializedRule = serializer.deserialize(rule.rule as RuleJson)

    return engine.evaluate(deserializedRule, context)
  }
}
