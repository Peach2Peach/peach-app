export const isContained = (object: Record<string, unknown>, biggerObject: Record<string, unknown>) =>
  Object.keys(object).every((key) => key in biggerObject && object[key] === biggerObject[key])
