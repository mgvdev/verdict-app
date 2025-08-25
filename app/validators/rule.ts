import vine from '@vinejs/vine'

export const createRuleValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
    /**
     * The rule should follow the Verdict object format, but
     * for now we are allowing any type of object cause the rule
     * is created by the builder in frontend so the user can't
     * create a rule with invalid format.
     */
    rule: vine.any(),
    context: vine.string(),
  })
)

export const updateRuleValidator = createRuleValidator
