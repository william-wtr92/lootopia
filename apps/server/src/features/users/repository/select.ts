import { defaultLevel, defaultXP } from "@lootopia/common"
import {
  artifacts,
  crowns,
  huntParticipations,
  hunts,
  userArtifacts,
  userLevels,
  users,
} from "@lootopia/drizzle"
import { sanitizeUser } from "@server/features/users/dto"
import { db } from "@server/utils/clients/postgres"
import { eq, ilike, count, countDistinct } from "drizzle-orm"

export const selectUserByEmail = async (email: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export const selectUserByNickname = async (nickname: string) => {
  const [row] = await db
    .select({
      user: users,
      progression: {
        level: userLevels.level,
      },
    })
    .from(users)
    .where(eq(users.nickname, nickname))
    .leftJoin(userLevels, eq(users.id, userLevels.userId))

  if (!row) {
    return null
  }

  return {
    ...row.user,
    progression: {
      level: row.progression?.level ?? defaultLevel,
    },
  }
}

export const selectUserByPhone = async (phone: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.phone, phone),
  })
}

export const selectUserWithCrownsAndProgression = async (email: string) => {
  const [artifactCountRow] = await db
    .select({ count: countDistinct(userArtifacts.id) })
    .from(userArtifacts)
    .leftJoin(users, eq(users.id, userArtifacts.userId))
    .where(eq(users.email, email))

  const [row] = await db
    .select({
      user: users,
      crowns: crowns.amount,
      progression: {
        level: userLevels.level,
        experience: userLevels.experience,
      },
    })
    .from(users)
    .where(eq(users.email, email))
    .leftJoin(crowns, eq(users.id, crowns.userId))
    .leftJoin(userLevels, eq(users.id, userLevels.userId))

  if (!row) {
    return null
  }

  return {
    ...sanitizeUser(row.user, ["role", "avatar", "mfaEnabled"]),
    crowns: row.crowns ?? null,
    progression: {
      level: row.progression?.level ?? defaultLevel,
      experience: row.progression?.experience ?? defaultXP,
    },
    stats: {
      artifactsCount: Number(artifactCountRow?.count ?? 0),
    },
  }
}

export const selectUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  })
}

export const selectUsers = async (
  limit: number,
  page: number,
  search: string
) => {
  return db.query.users.findMany({
    where: (users, { ilike }) => {
      if (search) {
        return ilike(users.nickname, `%${search}%`)
      }

      return undefined
    },
    limit,
    offset: page * limit,
  })
}

export const selectUsersCount = async (search: string) => {
  return db
    .select({ count: count() })
    .from(users)
    .where(ilike(users.nickname, `%${search}%`))
}

export const selectUserWithHuntsAndArtifacts = async (nickname: string) => {
  const [artifactCountRow] = await db
    .select({ count: countDistinct(userArtifacts.id) })
    .from(userArtifacts)
    .leftJoin(users, eq(users.id, userArtifacts.userId))
    .where(eq(users.nickname, nickname))

  const [huntCountRow] = await db
    .select({ count: countDistinct(huntParticipations.id) })
    .from(huntParticipations)
    .leftJoin(users, eq(users.id, huntParticipations.userId))
    .where(eq(users.nickname, nickname))

  const rows = await db
    .select({
      user: users,
      progression: {
        level: userLevels.level,
      },
      hunts: {
        id: hunts.id,
        name: hunts.name,
        description: hunts.description,
        startDate: hunts.startDate,
        endDate: hunts.endDate,
        city: hunts.city,
      },
      artifacts: {
        id: artifacts.id,
        name: artifacts.name,
        rarity: artifacts.rarity,
        obtainedAt: userArtifacts.obtainedAt,
        huntName: hunts.name,
      },
    })
    .from(users)
    .where(eq(users.nickname, nickname))
    .leftJoin(userLevels, eq(users.id, userLevels.userId))
    .leftJoin(huntParticipations, eq(users.id, huntParticipations.userId))
    .leftJoin(hunts, eq(huntParticipations.huntId, hunts.id))
    .leftJoin(userArtifacts, eq(users.id, userArtifacts.userId))
    .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))

  if (!rows) {
    return null
  }

  const { user, progression } = rows[0]

  const huntsMap = new Map<string, (typeof rows)[0]["hunts"]>()
  const artifactsMap = new Map<string, (typeof rows)[0]["artifacts"]>()

  for (const row of rows) {
    if (row.hunts?.id && !huntsMap.has(row.hunts.id)) {
      huntsMap.set(row.hunts.id, row.hunts)
    }

    if (row.artifacts?.id && !artifactsMap.has(row.artifacts.id)) {
      artifactsMap.set(row.artifacts.id, row.artifacts)
    }
  }

  const rarityOrder = {
    legendary: 1,
    epic: 2,
    rare: 3,
    uncommon: 4,
    common: 5,
  }

  return {
    user: sanitizeUser(user, ["avatar", "createdAt"], { private: false }),
    progression: {
      level: progression?.level ?? defaultLevel,
    },
    stats: {
      artifactsCount: artifactCountRow?.count ?? 0,
      huntsCount: huntCountRow?.count ?? 0,
    },
    hunts: Array.from(huntsMap.values())
      .sort(
        (a, b) =>
          new Date(b?.startDate ?? 0).getTime() -
          new Date(a?.startDate ?? 0).getTime()
      )
      .slice(0, 5),

    artifacts: Array.from(artifactsMap.values())
      .sort((a, b) => {
        const dateA = new Date(b?.obtainedAt ?? 0).getTime()
        const dateB = new Date(a?.obtainedAt ?? 0).getTime()

        return dateA - dateB
      })
      .slice(0, 20)
      .sort((a, b) => {
        const rarityA = rarityOrder[a.rarity ?? "common"]
        const rarityB = rarityOrder[b.rarity ?? "common"]

        return rarityA - rarityB
      })
      .slice(0, 10),
  }
}
