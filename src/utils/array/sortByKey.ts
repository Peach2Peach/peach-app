export const sortByKey =
  <K extends string>(key: K, order = "asc") =>
  <O extends Record<K, string | number | Date>>(a: O, b: O) =>
    a[key] > b[key] ? (order === "asc" ? 1 : -1) : order === "asc" ? -1 : 1;
