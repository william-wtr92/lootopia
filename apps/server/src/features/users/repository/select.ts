import { defaultLevel, defaultXP } from "@lootopia/common"
import {
  crowns,
  huntParticipations,
  hunts,
  userArtifacts,
  userLevels,
  users,
  artifacts,
  chests,
} from "@lootopia/drizzle"
import { sanitizeUser } from "@server/features/users/dto"
import { db } from "@server/utils/clients/postgres"
import { eq, ilike, count, countDistinct, desc } from "drizzle-orm"

export const selectIfUserIsActive = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.email, email), eq(users.active, true)),
  })
}

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
  const rows = await db
    .select({
      user: users,
      level: userLevels.level,
    })
    .from(users)
    .leftJoin(userLevels, eq(users.id, userLevels.userId))
    .where(search ? ilike(users.nickname, `%${search}%`) : undefined)
    .limit(limit)
    .offset(page * limit)

  if (rows.length === 0) {
    return []
  }

  return rows.map((row) => ({
    ...sanitizeUser(
      {
        ...row.user,
        progression: {
          level: row.level ?? defaultLevel,
          experience: defaultXP,
        },
      },
      ["avatar"],
      { private: false }
    ),
  }))
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

  const [userRow] = await db
    .select({
      user: users,
      progression: {
        level: userLevels.level,
      },
    })
    .from(users)
    .where(eq(users.nickname, nickname))
    .leftJoin(userLevels, eq(users.id, userLevels.userId))

  if (!userRow) {
    return null
  }

  const huntsRaw = await db
    .select({
      id: hunts.id,
      name: hunts.name,
      description: hunts.description,
      startDate: hunts.startDate,
      endDate: hunts.endDate,
      city: hunts.city,
    })
    .from(hunts)
    .innerJoin(huntParticipations, eq(hunts.id, huntParticipations.huntId))
    .innerJoin(users, eq(users.id, huntParticipations.userId))
    .where(eq(users.nickname, nickname))
    .orderBy(desc(hunts.startDate))
    .limit(5)

  const artifactsRaw = await db
    .select({
      id: artifacts.id,
      name: artifacts.name,
      rarity: artifacts.rarity,
      obtainedAt: userArtifacts.obtainedAt,
      huntName: hunts.name,
    })
    .from(artifacts)
    .innerJoin(userArtifacts, eq(artifacts.id, userArtifacts.artifactId))
    .innerJoin(users, eq(users.id, userArtifacts.userId))
    .leftJoin(chests, eq(userArtifacts.obtainedFromChestId, chests.id))
    .leftJoin(hunts, eq(chests.huntId, hunts.id))
    .where(eq(users.nickname, nickname))
    .orderBy(desc(userArtifacts.obtainedAt))
    .limit(20)

  const rarityOrder = {
    legendary: 1,
    epic: 2,
    rare: 3,
    uncommon: 4,
    common: 5,
  }

  const artifactsRawSorted = artifactsRaw
    .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
    .slice(0, 9)

  return {
    user: sanitizeUser(userRow.user, ["avatar", "createdAt"], {
      private: false,
    }),
    progression: {
      level: userRow.progression?.level ?? defaultLevel,
    },
    stats: {
      artifactsCount: artifactCountRow?.count ?? 0,
      huntsCount: huntCountRow?.count ?? 0,
    },
    hunts: huntsRaw,
    artifacts: artifactsRawSorted,
  }
}
