const MAX_DETAILS_LENGTH = 240;

const stringifyDetail = (detail: unknown): string => {
  if (typeof detail === "string") return detail;
  if (typeof detail === "number" || typeof detail === "boolean")
    return String(detail);
  if (!detail || typeof detail !== "object") return "";

  const { path, param, field, msg, message } = detail as Record<
    string,
    unknown
  >;
  const fieldName = [path, param, field].find((v) => typeof v === "string");
  const reason = [msg, message].find((v) => typeof v === "string");

  if (reason) return fieldName ? `${fieldName}: ${reason}` : `${reason}`;
  if (fieldName) return `${fieldName}`;

  try {
    return JSON.stringify(detail);
  } catch {
    return "";
  }
};

/**
 * @description Turns the `details` of an API error (or the `cause` of an Error
 * carrying them) into a human readable string that can be passed as a toast
 * body argument. Returns an empty string when there are no usable details.
 */
export const parseErrorDetails = (details: unknown): string => {
  if (details === undefined || details === null) return "";

  const list = Array.isArray(details) ? details : [details];
  const text = list
    .map(stringifyDetail)
    .filter(Boolean)
    .join(", ")
    .replace(/\s+/gu, " ")
    .trim();

  return text.length > MAX_DETAILS_LENGTH
    ? `${text.slice(0, MAX_DETAILS_LENGTH)}…`
    : text;
};
