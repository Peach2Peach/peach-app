import { structureEventsByCountry } from './structureEventsByCountry'

const events: MeetupEvent[] = [
  {
    id: 'meetup.ES.1',
    country: 'ES',
    city: 'Barcelona',
    shortName: 'Meetup 1',
    longName: 'Long Meetup 1',
    featured: false,
    currencies: ['EUR'],
    superFeatured: false,
  },
  {
    id: 'meetup.DE.2',
    country: 'DE',
    city: 'Berlin',
    shortName: 'Meetup 2',
    longName: 'Long Meetup 2',
    featured: false,
    currencies: ['EUR'],
    superFeatured: false,
  },
  {
    id: 'meetup.FR.3',
    country: 'FR',
    city: 'Paris',
    shortName: 'Meetup 3',
    longName: 'Long Meetup 3',
    featured: false,
    currencies: ['EUR'],
    superFeatured: false,
  },
  {
    id: 'meetup.FR.4',
    country: 'FR',
    city: 'Toulouse',
    shortName: 'Meetup 4',
    longName: 'Long Meetup 4',
    featured: false,
    currencies: ['EUR'],
    superFeatured: false,
  },
  {
    id: 'meetup.DE.5',
    country: 'DE',
    city: 'München',
    shortName: 'Meetup 5',
    longName: 'Long Meetup 5',
    featured: false,
    currencies: ['EUR'],
    superFeatured: false,
  },
]
const expectedResult = {
  DE: [
    {
      id: 'meetup.DE.2',
      country: 'DE',
      city: 'Berlin',
      shortName: 'Meetup 2',
      longName: 'Long Meetup 2',
      featured: false,
      currencies: ['EUR'],
      superFeatured: false,
    },
    {
      id: 'meetup.DE.5',
      country: 'DE',
      city: 'München',
      shortName: 'Meetup 5',
      longName: 'Long Meetup 5',
      featured: false,
      currencies: ['EUR'],
      superFeatured: false,
    },
  ],
  ES: [
    {
      id: 'meetup.ES.1',
      country: 'ES',
      city: 'Barcelona',
      shortName: 'Meetup 1',
      longName: 'Long Meetup 1',
      featured: false,
      currencies: ['EUR'],
      superFeatured: false,
    },
  ],
  FR: [
    {
      id: 'meetup.FR.3',
      country: 'FR',
      city: 'Paris',
      shortName: 'Meetup 3',
      longName: 'Long Meetup 3',
      featured: false,
      currencies: ['EUR'],
      superFeatured: false,
    },
    {
      id: 'meetup.FR.4',
      country: 'FR',
      city: 'Toulouse',
      shortName: 'Meetup 4',
      longName: 'Long Meetup 4',
      featured: false,
      currencies: ['EUR'],
      superFeatured: false,
    },
  ],
}

describe('structureEventsByCountry', () => {
  it('correctly structures events by country', () => {
    const result = events.reduce(structureEventsByCountry, {} as CountryEventsMap)

    expect(result).toEqual(expectedResult)
  })
})
