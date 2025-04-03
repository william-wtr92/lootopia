// ERROR MESSAGES

export const huntNotFound = {
  result: "Hunt not found.",
  key: "huntNotFound",
} as const

export const huntEndDateEarlierThanStartDate = {
  result: "End date must be after start date.",
  key: "huntEndDateEarlierThanStartDate",
} as const

export const notHuntOrganizer = {
  result: "You are not the organizer of this hunt.",
  key: "notHuntOrganizer",
} as const

export const maxCrownRewardExceeded = {
  result: "Max crown reward exceeded.",
  key: "maxCrownRewardExceeded",
} as const

// SUCCESS MESSAGES

export const huntCreatedSuccess = {
  result: "Hunt created successfully.",
  key: "huntCreatedSuccess",
} as const

export const huntUpdatedSuccess = {
  result: "Hunt updated successfully.",
  key: "huntUpdatedSuccess",
} as const
