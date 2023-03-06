/**
 * @description Method to filter array for unique values
 * @param [key] set if values are objects, filter by key
 * @returns curried function to filter unique values
 * @example ['a', 'a', 'c'].filter(unique())
 */
export const unique = (key?: string) => {
  if (key) {
    return (obj: any, index: number, self: any[]) =>
      obj[key] && self.findIndex((s) => s[key].toString() === obj[key].toString()) === index
  }

  return (obj: any, index: number, self: any[]) => self.findIndex((s) => s === obj) === index
}
