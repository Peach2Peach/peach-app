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
    IT: [],
    PT: [],
    ES: [],
    HR: [],
    FR: [],
    DE: [],
    GR: [],
    BR: [],
    CO: [],
    IN: [],
    AD: [],
    AE: [],
    AT: [],
    BA: [],
    BE: [],
    BG: [],
    CD: [],
    CH: [],
    CI: [],
    CY: [],
    GB: [],
    JP: [],
    KE: [],
    LV: [],
    ME: [],
    MK: [],
    MT: [],
    NG: [],
    NL: [],
    PL: [],
    RS: [],
    SI: [],
    TH: [],
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
