import { getError } from "./getError";
import { getOk } from "./getOk";

export const getResult = <R, E>(result?: R, error?: E) => {
  const isOk = !!result && !error;
  if (isOk) return getOk(result);

  return getError(error, result);
};
