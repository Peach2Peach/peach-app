/**
 * @description Method to transform bitcoin address into short representation
 */
export const cutOffAddress = (address: string) => {
  if (address.length < 15) {
    return address
  }
  return `${address.slice(0, 8)} ... ${address.slice(-6)}`
}
