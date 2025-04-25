import { BitcoinEvent } from "../../../../peach-api/src/@types/events";
import { sortAlphabetically } from "../../../utils/array/sortAlphabetically";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { mapEventToDrawerOption } from "./mapEventToDrawerOption";

export const getCountrySelectDrawerOptions = (
  meetupEvents: BitcoinEvent[],
  goToEventDetails: (eventID: string) => void,
  selectCountry: (
    eventsByCountry: Record<string, BitcoinEvent[]>,
    selected: string,
  ) => void,
) => {
  const eventsByCountry: Record<string, BitcoinEvent[]> = {};

  meetupEvents.forEach((event) => {
    if (!eventsByCountry[event.country]) {
      eventsByCountry[event.country] = [];
    }
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
        .map((country) => ({
          title: i18n(`country.${country}`),
          flagID: country,
          onPress: () => selectCountry(eventsByCountry, country),
        }))
        .sort((a, b) => sortAlphabetically(a.title, b.title)),
    ],
    show: true,
  };
};
