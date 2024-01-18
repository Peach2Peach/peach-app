const END_OF_FIRST_PART = 4
const END_OF_SECOND_PART = 9
const END_OF_THIRD_PART = -5
export const getBitcoinAddressParts = (address: string) => ({
  one: address.slice(0, END_OF_FIRST_PART),
  two: address.slice(END_OF_FIRST_PART, END_OF_SECOND_PART),
  three: address.slice(END_OF_SECOND_PART, END_OF_THIRD_PART),
  four: address.slice(END_OF_THIRD_PART),
})
