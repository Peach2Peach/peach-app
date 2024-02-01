import { MSINADAY } from "../../constants";

export const getTimeDiffInDays = (date: Date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / MSINADAY);
