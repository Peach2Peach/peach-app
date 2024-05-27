export function isRUTValid(rut: string) {
  const rutMax = 11;
  const rutMagic = 7;
  const rutTen = 10;

  if (!rut || !/^(\d{1,3}(\.?\d{3})*)-\w$/u.test(rut)) {
    return false;
  }

  const [body, checkDigitInitial] = rut.replace(/\./gu, "").split("-");
  let checkDigit = checkDigitInitial;

  if (checkDigit === "k") checkDigit = "K";

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], rutTen) * multiplier;
    multiplier = multiplier === rutMagic ? 2 : multiplier + 1;
  }
  const computedDigit = rutMax - (sum % rutMax);
  let expectedDigit;
  if (computedDigit === rutMax) {
    expectedDigit = "0";
  } else if (computedDigit === rutTen) {
    expectedDigit = "K";
  } else {
    expectedDigit = computedDigit.toString();
  }

  return expectedDigit === checkDigit;
}
