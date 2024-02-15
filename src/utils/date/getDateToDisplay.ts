import i18n from "../i18n";
import { getTimeDiffInDays } from "./getTimeDiffInDays";

/**
 * Returns a string with the date and the number of days ago
 * @param date
 * @returns {string}
 * @example
 * getDateToDisplay(new Date('2019-01-01')) // '01/01/2019 (1 day ago)'
 */
export const getDateToDisplay = (date: Date) => {
  const newDate = new Date(date);
  const dateString = newDate.toLocaleDateString("en-GB");
  const numberOfDays = getTimeDiffInDays(newDate);

  const dayAndHalf = 1.5
  const almostADay = 0.9999

  // eslint-disable-next-line no-magic-numbers
  const years = numberOfDays >= 365 ? Math.trunc(numberOfDays / 365) : 0
  const remainingDays = years > 0 ? numberOfDays - (365 * years) : 0


  const daysAgo =
    years > 0 ? years === 1 ? i18n("profile.oneYearAgo", String(years), String(remainingDays))
      : i18n("profile.yearsAgo", String(years), String(remainingDays))
        : numberOfDays > dayAndHalf ? i18n("profile.daysAgo", String(getTimeDiffInDays(newDate)))
          : numberOfDays > almostADay ? i18n("yesterday")
            : i18n("today")

  return `${dateString} (${daysAgo})`;
};
