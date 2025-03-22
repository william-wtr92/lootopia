import type { ChestSchema } from "@common/index"

type AdditionalChestFields = Pick<ChestSchema, "position">

export const sanitizeChest = <T extends keyof AdditionalChestFields>(
  chest: ChestSchema,
  additionalFields: T[] = []
) => {
  if (chest.visibility) {
    additionalFields.push("position" as T)
  }

  const additionalData: any = additionalFields.reduce((acc, field) => {
    acc[field] = chest[field]

    return acc
  }, {} as any)

  const finalChest = {
    ...chest,
    ...(additionalData.position
      ? {
          position: {
            x: additionalData.position.coordinates[0],
            y: additionalData.position.coordinates[1],
          },
        }
      : {}),
  }

  return finalChest
}
