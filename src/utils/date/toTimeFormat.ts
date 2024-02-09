import { isDefined } from "../validation/isDefined";

export const toTimeFormat = (
  hours: number,
  minutes: number,
  seconds?: number,
) =>
  [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    isDefined(seconds) ? String(seconds).padStart(2, "0") : undefined,
  ]
    .filter(isDefined)
    .join(":");
