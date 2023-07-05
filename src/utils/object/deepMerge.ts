export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const mergedObject = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (targetValue && typeof targetValue === 'object' && sourceValue && typeof sourceValue === 'object') {
        mergedObject[key] = deepMerge(targetValue, sourceValue)
      } else if (sourceValue !== undefined) {
        mergedObject[key] = sourceValue
      }
    }
  }

  return mergedObject
}
