import { structureEventsByCountry } from '../../../../src/utils/events'

describe('structureEventsByCountry', () => {
  it('correctly structures events by country', () => {
    const events: MeetupEvent[] = [
      { id: 'meetup.ES.1', country: 'ES', city: 'Barcelona', name: 'Meetup 1' },
      { id: 'meetup.DE.2', country: 'DE', city: 'Berlin', name: 'Meetup 2' },
      { id: 'meetup.FR.3', country: 'FR', city: 'Paris', name: 'Meetup 3' },
      { id: 'meetup.FR.4', country: 'FR', city: 'Toulouse', name: 'Meetup 4' },
      { id: 'meetup.DE.5', country: 'DE', city: 'München', name: 'Meetup 5' },
    ]

    const expectedResult = {
      DE: [
        { id: 'meetup.DE.2', country: 'DE', city: 'Berlin', name: 'Meetup 2' },
        { id: 'meetup.DE.5', country: 'DE', city: 'München', name: 'Meetup 5' },
      ],
      ES: [{ id: 'meetup.ES.1', country: 'ES', city: 'Barcelona', name: 'Meetup 1' }],
      FR: [
        { id: 'meetup.FR.3', country: 'FR', city: 'Paris', name: 'Meetup 3' },
        { id: 'meetup.FR.4', country: 'FR', city: 'Toulouse', name: 'Meetup 4' },
      ],
    }

    const result = events.reduce(structureEventsByCountry, {} as CountryEventsMap)

    expect(result).toEqual(expectedResult)
  })
})
