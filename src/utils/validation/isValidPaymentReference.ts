const forbiddenWords = ["bitcoin", "peach"];

export const isValidPaymentReference = (reference: string) =>
  forbiddenWords.every((word) => !reference.toLowerCase().includes(word));
