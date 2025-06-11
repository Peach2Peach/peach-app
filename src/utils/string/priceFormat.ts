import { groupChars } from "./groupChars";

export const priceFormat = (
  amount: number,
  round?: boolean,
  separator?: string,
) => {
  if (amount === Infinity) return "∞";
  const [integer, decimal] = amount.toFixed(2).split(".");
  const groupSize = 3;

  return round
    ? groupChars(amount.toFixed(), groupSize, separator)
    : [groupChars(integer, groupSize, separator), decimal].join(".");
};
