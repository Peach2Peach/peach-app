export const omit = <T extends Record<string, unknown>, A extends keyof T>(
  obj: T,
  attr: A,
): Omit<T, A> => {
  const { [attr]: _omit, ...newObj } = obj;
  return newObj;
};
