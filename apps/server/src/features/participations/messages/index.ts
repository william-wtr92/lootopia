// ERROR MESSAGES

export const organizerCannotBeParticipant = {
  result: "Organizer cannot be a participant.",
  key: "organizerCannotBeParticipant",
} as const

export const userIsNotOrganizerOfHunt = {
  result: "User is not the organizer of the hunt.",
  key: "userIsNotOrganizerOfHunt",
} as const

export const cannotJoinPrivateHuntDirectly = {
  result: "You cannot join a private hunt directly.",
  key: "cannotJoinPrivateHuntDirectly",
} as const

export const huntIsFull = {
  result: "The hunt is full.",
  key: "huntIsFull",
} as const

export const cannotRequestOnPublicHunt = {
  result: "Making a request on a public hunt is not allowed.",
  key: "cannotRequestOnPublicHunt",
} as const

export const participationAlreadyExists = {
  result: "Participation already exists.",
  key: "participationAlreadyExists",
} as const

export const participationRequestNotFound = {
  result: "Participation request not found.",
  key: "participationRequestNotFound",
} as const

export const cannotResendRequestYet = {
  result: "You cannot resend the request yet.",
  key: "cannotResendRequestYet",
} as const

// SUCCESS MESSAGES

export const participationSuccess = {
  result: "Participation registered.",
  key: "participationSuccess",
} as const

export const participationDeleted = {
  result: "Participation deleted.",
  key: "participationDeleted",
} as const

export const participationRequestSuccess = {
  result: "Participation request sent.",
  key: "participationRequestSuccess",
} as const

export const participationRequestDeleted = {
  result: "Participation request deleted.",
  key: "participationRequestDeleted",
} as const

export const participationRequestAccepted = {
  result: "Participation request accepted.",
  key: "participationRequestAccepted",
} as const

export const participationRequestRejected = {
  result: "Participation request rejected.",
  key: "participationRequestRejected",
} as const
