import { groupChars } from "./groupChars";

export const thousands = (number: number, delimiter = " "): string => {
  const [integer, decimal] = number.toString().split(".");
  const groupSize = 3;
  if (decimal === undefined) return groupChars(integer, groupSize, delimiter);
  return `${groupChars(integer.toString(), groupSize, delimiter)}.${decimal}`;
};
