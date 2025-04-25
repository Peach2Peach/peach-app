export const enforcePhoneFormat = (number: string) => {
  let formattedNumber = number.replace(/[^0-9+]/gu, "");
  if (formattedNumber.length && !/^\+/gu.test(formattedNumber)) {
    formattedNumber = `+${formattedNumber}`;
  }
  return formattedNumber;
};
