import { CENT } from "../../constants";
import i18n from "../i18n";
import { getTimeDiffInDays } from "./getTimeDiffInDays";

const daysInYear = 365;
/**
 * @example
 * getDateToDisplay(new Date('2019-01-01')) // '01/01/2019 (1 day ago)'
 */
export const getDateToDisplay = (date: Date) => {
  const newDate = new Date(date);
  const dateString = newDate.toLocaleDateString("en-GB");
  const totalDays = getTimeDiffInDays(newDate);

  const currentYear = new Date(Date.now()).getFullYear();
  const newDateYear = newDate.getFullYear();
  const numberOfYears = currentYear - newDateYear;
  const numberOfDays =
    totalDays -
    numberOfYears * daysInYear -
    getAmountOfLeapYears(newDateYear, currentYear);

  return `${dateString} (${
    numberOfYears > 0
      ? numberOfYears === 1
        ? i18n(
            "profile.oneYearAgo",
            String(numberOfYears),
            String(numberOfDays),
          )
        : i18n("profile.yearsAgo", String(numberOfYears), String(numberOfDays))
      : numberOfDays > 1
        ? i18n("profile.daysAgo", String(getTimeDiffInDays(newDate)))
        : numberOfDays === 1
          ? i18n("yesterday")
          : i18n("today")
  })`;
};

function getAmountOfLeapYears(startYear: number, endYear: number) {
  let amountOfLeapYears = 0;
  for (let i = startYear; i < endYear; i++) {
    if (isLeapYear(i)) {
      amountOfLeapYears++;
    }
  }
  return amountOfLeapYears;
}

const leapYearFrequency = 4;
const leapCenturyFrequency = 400;
function isLeapYear(year: number) {
  return (
    (year % leapYearFrequency === 0 && year % CENT !== 0) ||
    year % leapCenturyFrequency === 0
  );
}
