import { splitAt } from '.'

/**
 * @description Method to transform bitcoin address into short representation
 * @param address bitcoin address
 * @returns address cut in the middle and replaced with ...
 */
export const cutOffAddress = (address: string) => {
  const addressParts = {
    one: address.slice(0, 8),
    two: address.slice(8, -5),
    three: address.slice(-5),
  }
  addressParts.two = splitAt(addressParts.two, Math.floor(addressParts.two.length / 2) - 2).join('\n')

  return `${addressParts.one}...${addressParts.three}`
}

export default cutOffAddress

export const newCutOffAddress = (address: string) => {
  if (address.length < 15) {
    return address
  }
  return `${address.slice(0, 8)} ... ${address.slice(-6)}`
}
