/**
 * @description Method to convert hex to offer id
 * @param hex hex representation of offer id
 * @returns offer id
 */
export const hexToOfferId = (hex: string) => parseInt(hex.replace('P', ''), 16)