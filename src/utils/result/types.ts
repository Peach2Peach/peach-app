export interface Ok<R> {
  result: R
  error: undefined
  getValue(): R
  isOk(): true
  isError(): false
  getError(): undefined
}
export interface Err<E, R> {
  result: R | undefined
  error: E
  isOk(): false
  getValue(): R | undefined
  isError(): true
  getError(): E
}
export interface Result<R, E> {
  result?: R
  error?: E
  isOk(): this is Ok<R>
  getValue(): R | undefined
  isError(): this is Err<E, R>
  getError(): E | undefined
}
