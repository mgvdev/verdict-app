import vine from '@vinejs/vine'

export const createApiKeyValidator = vine.withMetaData<{ projectId: string }>().compile(
  vine.object({
    name: vine.string().unique(async (db, value, { meta }) => {
      const apiKey = await db
        .from('api_keys')
        .where('name', value)
        .where('project_id', meta.projectId)
        .first()
      return !apiKey
    }),
  })
)
