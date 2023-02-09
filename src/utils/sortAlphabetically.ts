// order an array of objects with name
export const sortAlphabetically = (a: string, b: string) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}
