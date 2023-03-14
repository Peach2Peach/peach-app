export const isRejectedPromise = <T>(promise: PromiseSettledResult<T>): promise is PromiseRejectedResult =>
  promise.status === 'rejected'
