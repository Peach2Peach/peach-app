export const enforceWalletFormat = (text: string) => {
  // Remove any spaces from the entered text
  const formattedText = text.replace(/\s/u, '')
  // Add spaces at the appropriate positions
  const formattedValue = formattedText
    .toUpperCase()
    .replace(/^([A-Z])/u, '$1 ') // Add space after first letter
    .replace(/([A-Za-z\d]{4})?([A-Za-z\d]{4})/u, '$1 $2 ') // Add space after every 4 digits
  return formattedValue
}
