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
  const eventsByCountry: Record<BitcoinEvent["country"], BitcoinEvent[]> = {};

  meetupEvents.forEach((event) => {
    const existingEvents = eventsByCountry[event.country];
    eventsByCountry[event.country] = existingEvents
      ? [...existingEvents, event]
      : [event];
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
