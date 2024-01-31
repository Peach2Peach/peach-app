export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const mergedObject = { ...target };

  for (const key in source) {
    if (key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (typeof targetValue === "object" && typeof sourceValue === "object") {
        mergedObject[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        mergedObject[key] = sourceValue;
      }
    }
  }

  return mergedObject;
};
