/* eslint-disable @typescript-eslint/no-explicit-any */
export const translateDynamicKey = <T extends (key: any) => any>(
  t: T,
  key: string
) => {
  return t(key)
}
