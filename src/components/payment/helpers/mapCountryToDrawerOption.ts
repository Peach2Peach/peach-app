import i18n from "../../../utils/i18n";

export const mapCountryToDrawerOption =
  (
    onPress: (
      eventsByCountry: CountryEventsMap,
      selected: MeetupCountries,
    ) => void,
    eventsByCountry: CountryEventsMap,
  ) =>
  (country: MeetupCountries) => ({
    title: i18n(`country.${country}`),
    flagID: country,
    onPress: () => onPress(eventsByCountry, country),
  });
