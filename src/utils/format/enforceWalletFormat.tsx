export const enforceWalletFormat = (text: string) => {
  const formattedValue = text.split(' ').join('')
    .toUpperCase()
  return formattedValue
}
