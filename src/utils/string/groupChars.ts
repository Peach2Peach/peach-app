export const groupChars = (string = "", sets = 1, separator = " "): string =>
  string
    .split("")
    .reverse()
    .reduce(
      (str, char, i) =>
        i % sets === 0 && i >= sets
          ? `${char}${separator}${str}`
          : `${char}${str}`,
      "",
    );
