import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ApiKey from '#models/api_key'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    apiClient?: ApiKey
  }
}

/**
 * Middleware use when a client calls api endpoint
 * Should check api key and token and log each successful call
 * to have stats about api usage and billing capabilities
 */
export default class ApiAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ error: 'Token not provided' })
    }

    const token = authHeader.replace('Bearer ', '')
    const [key, secret] = token.split('.')

    const apiKey = await ApiKey.query().where('key', key).first()

    if (!apiKey) {
      return ctx.response.unauthorized({ error: 'Invalid token' })
    }

    const isValid = await hash.verify(apiKey.secret, secret)
    if (!isValid) {
      return ctx.response.unauthorized({ error: 'Invalid token' })
    }

    ctx.apiClient = apiKey

    apiKey.lastUsedAt = DateTime.now()
    await apiKey.save()

    return await next()
  }
}
