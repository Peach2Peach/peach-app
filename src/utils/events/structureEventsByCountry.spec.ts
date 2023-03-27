import { structureEventsByCountry } from '.'

describe('structureEventsByCountry', () => {
  it('correctly structures events by country', () => {
    const events: MeetupEvent[] = [
      { id: 'meetup.ES.1', country: 'ES', city: 'Barcelona', shortName: 'Meetup 1', longName: 'Long Meetup 1' },
      { id: 'meetup.DE.2', country: 'DE', city: 'Berlin', shortName: 'Meetup 2', longName: 'Long Meetup 2' },
      { id: 'meetup.FR.3', country: 'FR', city: 'Paris', shortName: 'Meetup 3', longName: 'Long Meetup 3' },
      { id: 'meetup.FR.4', country: 'FR', city: 'Toulouse', shortName: 'Meetup 4', longName: 'Long Meetup 4' },
      { id: 'meetup.DE.5', country: 'DE', city: 'München', shortName: 'Meetup 5', longName: 'Long Meetup 5' },
    ]

    const expectedResult = {
      DE: [
        { id: 'meetup.DE.2', country: 'DE', city: 'Berlin', shortName: 'Meetup 2', longName: 'Long Meetup 2' },
        { id: 'meetup.DE.5', country: 'DE', city: 'München', shortName: 'Meetup 5', longName: 'Long Meetup 5' },
      ],
      ES: [{ id: 'meetup.ES.1', country: 'ES', city: 'Barcelona', shortName: 'Meetup 1', longName: 'Long Meetup 1' }],
      FR: [
        { id: 'meetup.FR.3', country: 'FR', city: 'Paris', shortName: 'Meetup 3', longName: 'Long Meetup 3' },
        { id: 'meetup.FR.4', country: 'FR', city: 'Toulouse', shortName: 'Meetup 4', longName: 'Long Meetup 4' },
      ],
    }

    const result = events.reduce(structureEventsByCountry, {} as CountryEventsMap)

    expect(result).toEqual(expectedResult)
  })
})
