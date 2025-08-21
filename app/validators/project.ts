import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
  })
)
