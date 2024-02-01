const FIRST_GROUP_END = 4;
const SECOND_GROUP_END = 6;
const THIRD_GROUP_END = 8;
const FOURTH_GROUP_END = 11;
export const enforceBICFormat = (bic: string) => {
  const formatted = bic.toUpperCase().replace(/[^A-Z0-9]/gu, "");
  return [
    formatted.substring(0, FIRST_GROUP_END),
    formatted.substring(FIRST_GROUP_END, SECOND_GROUP_END),
    formatted.substring(SECOND_GROUP_END, THIRD_GROUP_END),
    formatted.substring(THIRD_GROUP_END, FOURTH_GROUP_END),
  ]
    .filter((s) => s)
    .join(" ");
};
