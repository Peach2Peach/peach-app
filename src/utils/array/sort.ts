type SortingFunction = (a: any, b: any) => number

/**
 * @description Method to sort array as item or by referencing key
 * @param [key] set if values are objects, fisortlter by key
 * @returns curried function to sort values
 * @example ['a', 'a', 'c'].filter(sort())
 */
export const sort = (key?: string): SortingFunction => {
  if (key) {
    return (a: AnyObject, b: AnyObject) => {
      if (a[key] && !b[key]) return -1
      if (b[key] && !a[key]) return 1
      return a[key] === b[key] ? 0 : a[key] > b[key] ? 1 : -1
    }
  }

  return (a: string | number, b: string | number) => {
    if (a && !b) return -1
    if (b && !a) return 1
    return a === b ? 0 : a > b ? 1 : -1
  }
}
