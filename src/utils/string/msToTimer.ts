import { MSINAMINUTE, MSINANHOUR, MSINASECOND } from "../../constants";

export const msToTimer = (ms: number): string => {
  const hours = Math.floor(ms / MSINANHOUR);
  ms -= hours * MSINANHOUR;
  const minutes = Math.floor(ms / MSINAMINUTE);
  ms -= minutes * MSINAMINUTE;
  const seconds = Math.floor(ms / MSINASECOND);
  ms -= seconds * MSINASECOND;

  return [hours, minutes, seconds]
    .map((num) => num.toString().padStart(2, "0"))
    .join(":");
};
