import { Engine, RuleJson, RuleSerializer } from '@mgvdev/verdict'
import Rule from '#models/rule'

/*
|--------------------------------------------------------------------------
| Verdict Service
|--------------------------------------------------------------------------
|
| This service is used to call Verdict library
|
*/
export class VerdictService {
  /**
   * Evaluate a rule against a context
   * @param rule
   * @param context
   */
  evaluateRule(rule: Rule, context: object): boolean {
    const engine = new Engine()
    const serializer = new RuleSerializer()

    const deserializedRule = serializer.deserialize(
      JSON.parse(rule.rule as string) as unknown as RuleJson
    )

    return engine.evaluate(deserializedRule, context)
  }
}
