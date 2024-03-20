import { getTimeDiffInDays } from "./getTimeDiffInDays";
import { tolgee } from "../../tolgee";

/**
 * @example
 * getDateToDisplay(new Date('2019-01-01')) // '01/01/2019 (1 day ago)'
 */
export const getDateToDisplay = (date: Date) => {
  const newDate = new Date(date);
  const dateString = newDate.toLocaleDateString("en-GB");
  const numberOfDays = getTimeDiffInDays(newDate);
  const daysAgo =
    numberOfDays > 1
      ? tolgee.t("profile.daysAgo", {
          ns: "profile",
          days: String(getTimeDiffInDays(newDate)),
        })
      : numberOfDays === 1
        ? tolgee.t("yesterday", { ns: "global" })
        : tolgee.t("today", { ns: "global" });

  return `${dateString} (${daysAgo})`;
};
