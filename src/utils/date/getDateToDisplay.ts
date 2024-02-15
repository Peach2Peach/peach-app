import i18n from "../i18n";
import { getTimeDiffInDays } from "./getTimeDiffInDays";

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
      ? i18n("profile.daysAgo", String(getTimeDiffInDays(newDate)))
      : numberOfDays === 1
        ? i18n("yesterday")
        : i18n("today");

  return `${dateString} (${daysAgo})`;
};
