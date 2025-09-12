export const isValidDigitLength = (
  number: string,
  limit: number[] | number,
) => {
  // remove spaces and dashes
  const clean = number.replace(/[\s-]/g, "");

  return typeof limit === "number"
    ? new RegExp(`^\\d{${limit}}$`, "u").test(clean)
    : new RegExp(`^\\d{${limit[0]},${limit[1]}}$`, "u").test(clean);
};
