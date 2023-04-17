export const getAbortWithTimeout = (timeout?: number) => {
  const controller = new AbortController()
  if (timeout) setTimeout(() => controller.abort(), timeout)

  return controller
}
