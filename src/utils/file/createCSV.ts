export function createCSV<T>(
  data: T[],
  headers: string[],
  fields: { [key: string]: (d: T) => string | number },
) {
  let csvValue = `${headers.join(", ")}\n`;

  data.forEach((item) => {
    const row = headers.map((header) => fields[header](item)).join(", ");
    csvValue += `${row}\n`;
  });

  return csvValue;
}
