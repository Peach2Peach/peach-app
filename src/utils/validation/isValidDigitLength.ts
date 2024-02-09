export const isValidDigitLength = (number: string, limit: number[] | number) =>
  typeof limit === "number"
    ? RegExp(`^\\d{${limit}}$`, "u").test(number.split(" ").join(""))
    : RegExp(`^\\d{${limit[0]},${limit[1]}}$`, "u").test(
        number.split(" ").join(""),
      );
