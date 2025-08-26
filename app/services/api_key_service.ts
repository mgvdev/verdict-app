import ApiKey from '#models/api_key'
import { DateTime } from 'luxon'

export class ApiKeyService {
  async createApiKey(projectId: string, data: { name: string; createdBy: string }) {
    const key = await ApiKey.generateKey()
    const secret = await ApiKey.generateSecret()

    await ApiKey.create({
      project_id: projectId,
      created_by: data.createdBy,
      name: data.name,
      key,
      secret,
    })

    return {
      key: key,
      secret: `${key}.${secret}`,
    }
  }

  async revokeApiKey(id: string) {
    const apiKey = await ApiKey.findOrFail(id)
    apiKey.deletedAt = DateTime.now()
    await apiKey.save()
  }
}
