export const enforceWalletFormat = (text: string) =>
  text.replace(/[^a-z0-9]/giu, "").toUpperCase();
