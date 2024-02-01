export const enforceWalletFormat = (text: string) => {
  const formattedValue = text.replace(/[^a-z0-9]/giu, "").toUpperCase();
  return formattedValue;
};
