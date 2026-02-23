export default (str = "") =>
  typeof str === "string" && str.length
    ? str[0].toUpperCase() + str.slice(1)
    : "";
