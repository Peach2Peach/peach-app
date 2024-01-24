import { sortAlphabetically } from '../../../utils/array/sortAlphabetically'
import { structureEventsByCountry } from '../../../utils/events/structureEventsByCountry'
import i18n from '../../../utils/i18n'
import { keys } from '../../../utils/object/keys'
import { mapCountryToDrawerOption } from './mapCountryToDrawerOption'
import { mapEventToDrawerOption } from './mapEventToDrawerOption'

export const getCountrySelectDrawerOptions = (
  meetupEvents: MeetupEvent[],
  goToEventDetails: (eventID: MeetupEvent['id']) => void,
  selectCountry: (eventsByCountry: CountryEventsMap, selected: Country) => void,
) => {
  const eventsByCountry = meetupEvents.reduce(structureEventsByCountry, {} as CountryEventsMap)
  const featuredEvents = meetupEvents.filter((event) => event.featured).map(mapEventToDrawerOption(goToEventDetails))

  return {
    title: i18n('country.select'),
    options: [
      ...featuredEvents,
      ...keys(eventsByCountry)
        .map(mapCountryToDrawerOption(selectCountry, eventsByCountry))
        .sort((a, b) => sortAlphabetically(a.title, b.title)),
    ],
    show: true,
  }
}
