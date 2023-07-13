export const isContained = (object: Record<string, any>, biggerObject: Record<string, any>) =>
  Object.keys(object).every((key) => key in biggerObject && object[key] === biggerObject[key])
