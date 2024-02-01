export const interpolate = (
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number => {
  const relative = (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
  return outputRange[0] + (outputRange[1] - outputRange[0]) * relative;
};
