export const omit = (obj, key) => {
  const { [key]: omitted, ...newObj } = obj
  return newObj
}
