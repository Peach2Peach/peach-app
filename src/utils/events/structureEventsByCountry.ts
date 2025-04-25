import { BitcoinEvent } from "../../../peach-api/src/@types/events";

export const structureEventsByCountry = (
  obj: Record<BitcoinEvent["country"], BitcoinEvent[]>,
  event: BitcoinEvent,
) => ({
  ...obj,
  [event.country]: obj[event.country]
    ? [...obj[event.country], event]
    : [event],
});
