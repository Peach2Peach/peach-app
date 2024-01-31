import { keys } from "./keys";

export const invert = <K extends string, V extends string | number>(
  object: Record<K, V>,
): Record<V, K> =>
  keys(object).reduce(
    (obj, k) => {
      const v = object[k];
      return { ...obj, [v]: k };
    },
    {} as Record<V, K>,
  );
