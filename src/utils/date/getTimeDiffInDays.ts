import { MSINADAY } from "../../constants";

export function getTimeDiffInDays(date1: Date, date2 = new Date(Date.now())) {
  const startOfDayDate1 = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
  ).getTime();
  const startOfDayDate2 = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
  ).getTime();

  const differenceInMilliseconds = Math.abs(startOfDayDate1 - startOfDayDate2);
  const differenceInDays = Math.ceil(differenceInMilliseconds / MSINADAY);

  return differenceInDays;
}
