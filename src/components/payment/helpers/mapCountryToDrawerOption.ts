import i18n from '../../../utils/i18n'

export const mapCountryToDrawerOption
  = (onPress: (eventsByCountry: CountryEventsMap, selected: Country) => void, eventsByCountry: CountryEventsMap) =>
    (country: Country) => ({
      title: i18n(`country.${country}`),
      flagID: country,
      onPress: () => onPress(eventsByCountry, country),
    })
