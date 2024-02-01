import { Err } from "./types";

export const getError = <E, R>(error: E, result?: R): Err<E, R> => ({
  result,
  error,
  getValue: () => result,
  isOk: () => false,
  isError: () => true,
  getError: () => error,
});
