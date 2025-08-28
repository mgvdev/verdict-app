import User from '#models/user'
import Rule from '#models/rule'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class RulePolicy extends BasePolicy {
  delete(user: User, rule: Rule): AuthorizerResponse {
    return user.current_project_id === rule.project_id
  }
}
