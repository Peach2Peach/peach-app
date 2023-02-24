export const enforceWalletFormat = (text: string) => {
  const formattedValue = text
    .replaceAll(' ', '')
    .toUpperCase()
    .replace(/^([A-Z])/u, '$1 ')
    .replace(/([A-Za-z\d]{4})?([A-Za-z\d]{4})/u, '$1 $2 ')
  return formattedValue
}
