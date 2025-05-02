/* Dates Object */
export const nowDate = new Date()
export const sixMonthsDate = new Date(
  new Date().setMonth(new Date().getMonth() + 6)
)

export const startOfCurrentMonth = new Date(
  nowDate.getFullYear(),
  nowDate.getMonth(),
  1
)

export const startOfPreviousMonth = new Date(
  nowDate.getFullYear(),
  nowDate.getMonth() - 1,
  1
)

export const startOfNextMonth = new Date(
  nowDate.getFullYear(),
  nowDate.getMonth() + 1,
  1
)

/* Current time in seconds + x */
export const now = Math.floor(Date.now() / 1000)
export const oneHour = Math.floor(Date.now() / 1000) + 60 * 60
export const oneDay = Math.floor(Date.now() / 1000) + 60 * 60 * 24
export const oneMonth = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30

/* Times not based on now */
export const oneMinuteTTL = 60
export const twoMinutesTTL = 2 * 60
export const fiveMinutesTTL = 5 * 60
export const tenMinutesTTL = 10 * 60
export const oneHourTTL = 60 * 60
export const oneDayTTL = 60 * 60 * 24
export const twoDaysTTL = 60 * 60 * 24 * 2
export const sevenDaysTTL = oneDayTTL * 7
export const thirtyDaysTTL = oneDayTTL * 30

/* Times in ms */
export const oneDayInMs = oneDayTTL * 1000

/* Times Custom */
export const huntTimeTTL = (endDate: Date) => {
  return Math.floor((new Date(endDate).getTime() - Date.now()) / 1000)
}

export const offerTime = (days: string) => {
  return new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000)
}

export const startOfMonth = new Date(
  nowDate.getFullYear(),
  nowDate.getMonth(),
  1
)

export const startOfLastMonth = new Date(
  nowDate.getFullYear(),
  nowDate.getMonth() - 1,
  1
)

export const getStartOfWeek = (date: Date = new Date()): Date => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  return startOfWeek
}

export const getStartOfLastWeek = (date: Date = new Date()): Date => {
  const startOfLastWeek = getStartOfWeek(date)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  return startOfLastWeek
}
