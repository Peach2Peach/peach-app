import { getServerErrorMessageKey } from "./error/serverErrorMessages";

/**
 * @description Method to parse errors (e.g. from a try-catch block)
 */
export const parseError = (e: Error | string | unknown): string => {
  let err = "UNKNOWN_ERROR";
  if (typeof e === "string") {
    err = getServerErrorMessageKey(e) ?? e.toUpperCase();
  } else if (e instanceof Error) {
    err = getServerErrorMessageKey(e.message) ?? e.message;
  }
  return err;
};
