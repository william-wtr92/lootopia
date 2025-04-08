export const getUpdateValue = <T>(
  predicate: boolean,
  key: keyof T,
  value: T[keyof T]
) => {
  return predicate ? { [key]: value } : undefined
}
