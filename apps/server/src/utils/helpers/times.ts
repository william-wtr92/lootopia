/* Dates Object */
export const nowDate = new Date()
export const sixMonthsDate = new Date(
  new Date().setMonth(new Date().getMonth() + 6)
)

/* Current time in seconds + x */
export const now = Math.floor(Date.now() / 1000)
export const oneHour = Math.floor(Date.now() / 1000) + 60 * 60
export const oneDay = Math.floor(Date.now() / 1000) + 60 * 60 * 24
export const oneMonth = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30

/* Times not based on now */
export const fiveMinutesTTL = 5 * 60
export const tenMinutesTTL = 10 * 60
export const oneHourTTL = 60 * 60
export const oneDayTTL = 60 * 60 * 24
export const twoDaysTTL = 60 * 60 * 24 * 2
export const sevenDaysTTL = oneDayTTL * 7
export const thirtyDaysTTL = oneDayTTL * 30

/* Times in ms */
export const oneDayInMs = oneDayTTL * 1000
