import { tolgee } from "../../../tolgee";

export const mapCountryToDrawerOption =
  (
    onPress: (eventsByCountry: CountryEventsMap, selected: Country) => void,
    eventsByCountry: CountryEventsMap,
  ) =>
  (country: Country) => ({
    title: tolgee.t(`country.${country}`, { ns: "global" }),
    flagID: country,
    onPress: () => onPress(eventsByCountry, country),
  });
