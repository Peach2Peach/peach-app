export const getBitcoinAddressParts = (address: string) => ({
  one: address.slice(0, 4),
  two: address.slice(4, 9),
  three: address.slice(9, -5),
  four: address.slice(-5),
})
