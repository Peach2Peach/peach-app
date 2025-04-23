import { BitcoinEvent } from "../../../../peach-api/src/@types/events";
import { sortAlphabetically } from "../../../utils/array/sortAlphabetically";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { mapCountryToDrawerOption } from "./mapCountryToDrawerOption";
import { mapEventToDrawerOption } from "./mapEventToDrawerOption";

export const getCountrySelectDrawerOptions = (
  meetupEvents: BitcoinEvent[],
  goToEventDetails: (eventID: string) => void,
  selectCountry: (
    eventsByCountry: Record<BitcoinEvent["country"], BitcoinEvent[]>,
    selected: BitcoinEvent["country"],
  ) => void,
) => {
  const eventsByCountry: Record<BitcoinEvent["country"], BitcoinEvent[]> = {
    AD: [],
    AT: [],
    BA: [],
    BE: [],
    BG: [],
    BR: [],
    CD: [],
    CH: [],
    CI: [],
    CY: [],
    CZ: [],
    DE: [],
    ES: [],
    FI: [],
    FR: [],
    GB: [],
    GH: [],
    GR: [],
    HN: [],
    HR: [],
    IT: [],
    KE: [],
    ME: [],
    MK: [],
    MT: [],
    NG: [],
    NL: [],
    PL: [],
    PT: [],
    RS: [],
    SI: [],
    UK: [],
    ZA: [],
  };

  meetupEvents.forEach((event) => {
    eventsByCountry[event.country].push(event);
  });
  const featuredEvents = meetupEvents
    .filter((event) => event.featured)
    .map(mapEventToDrawerOption(goToEventDetails));

  return {
    title: i18n("country.select"),
    options: [
      ...featuredEvents,
      ...keys(eventsByCountry)
        .map(mapCountryToDrawerOption(selectCountry, eventsByCountry))
        .sort((a, b) => sortAlphabetically(a.title, b.title)),
    ],
    show: true,
  };
};
