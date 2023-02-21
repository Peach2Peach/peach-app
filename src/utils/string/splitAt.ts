/**
 * @description Method to split a string into two at a specific index
 * @param string the string to be split
 * @param index where to split the string
 * @returns split string
 */
export const splitAt = (str: string, index: number): string[] => [str.slice(0, index), str.slice(index, str.length)]
