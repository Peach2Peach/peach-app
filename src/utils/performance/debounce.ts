/**
 * @description Method to allow debouncing of a function
 * @param fn the function to debounce
 * @param delay delay in ms
 * @returns returns delayed function
 */
export const debounce = (fn: (...args: any[]) => any, delay: number): (...args: any[]) => any => {
  let timerId: NodeJS.Timeout|null

  return (args: any[]) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(args)
      timerId = null
    }, delay)
  }
}