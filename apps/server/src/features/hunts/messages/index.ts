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

export const noHintFound = {
  result: "No hint found.",
  key: "noHintFound",
} as const

export const waitBeforeRequestingHint = {
  result: "You need to wait before requesting a hint.",
  key: "waitBeforeRequestingHint",
} as const

export const noChestFoundInArea = {
  result: "No chest found in the specified area.",
  key: "noChestFoundInArea",
} as const

export const waitBeforeDigging = {
  result: "You need to wait before digging again.",
  key: "waitBeforeDigging",
} as const

export const chestIssueReportToAdmin = {
  result: "There was a problem with the chest. Please report to admin.",
  key: "chestIssueReportToAdmin",
} as const

export const chestAlreadyDigged = {
  result: "You have already dug this chest.",
  key: "chestAlreadyDigged",
} as const

export const supiciousMovement = {
  result: "Suspicious movement detected.",
  key: "supiciousMovement",
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
