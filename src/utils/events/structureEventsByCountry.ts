import { BitcoinEvent } from "../../../peach-api/src/@types/events";

export const structureEventsByCountry = (
  obj: Record<BitcoinEvent["country"], BitcoinEvent[]>,
  event: BitcoinEvent,
) => {
  if (event.country in obj) {
    obj[event.country] = [...obj[event.country], event];
  } else {
    obj[event.country] = [event];
  }
  return obj;
};
