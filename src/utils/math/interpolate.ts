/**
 * @description Method map a value from one range to another (e.g. 0-1 to 0-10)
 * @param value value to interpolate
 * @param inputRange input range
 * @param outputRange output range
 * @returns interpolated value
 */
export const interpolate = (value: number, inputRange: [number, number], outputRange: [number, number]): number => {
  const relative = (value - inputRange[0]) / (inputRange[1] - inputRange[0])
  return outputRange[0] + (outputRange[1] - outputRange[0]) * relative
}
