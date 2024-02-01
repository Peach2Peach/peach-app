import { toTimeFormat } from "./toTimeFormat";

export const toShortDateFormat = (date: Date, showTime = false) =>
  [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("/") +
  (showTime ? ` ${toTimeFormat(date.getHours(), date.getMinutes())}` : "");
