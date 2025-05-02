// ERROR MESSAGES

export const artifactOfferAlreadyExists = {
  result: "Artifact offer already exists",
  key: "artifactOfferAlreadyExists",
} as const

export const artifactOfferNotFound = {
  result: "Artifact offer not found",
  key: "artifactOfferNotFound",
} as const

export const sellerCantBeBuyer = {
  result: "Seller can't be the buyer",
  key: "sellerCantBeBuyer",
} as const

export const artifactOfferPriceTooLow = {
  result: "Price must be at least 50",
  key: "artifactOfferPriceTooLow",
} as const

export const userIsNotSellerOfArtifactOffer = {
  result: "User is not the seller of the artifact offer",
  key: "userIsNotSellerOfArtifactOffer",
} as const

// SUCCESS MESSAGES

export const artifactOfferCreated = {
  result: "Artifact offer created",
  key: "artifactOfferCreated",
} as const

export const artifactOfferViewed = {
  result: "Artifact offer viewed",
  key: "artifactOfferViewed",
} as const

export const artifactOfferMarkedAsFavorite = {
  result: "Artifact offer marked as favorite",
  key: "artifactOfferMarkedAsFavorite",
} as const

export const artifactOfferPurchased = {
  result: "Artifact offer purchased",
  key: "artifactOfferPurchased",
} as const

export const artifactOfferCanceled = {
  result: "Artifact offer canceled",
  key: "artifactOfferCanceled",
} as const
