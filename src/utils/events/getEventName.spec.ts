import { getEventName } from '.'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'

describe('getEventName', () => {
  useMeetupEventsStore.setState({
    meetupEvents: [
      {
        id: '1',
        shortName: 'event 1',
        country: 'DE',
        city: '',
        longName: '',
        currencies: ['EUR'],
        featured: false,
        superFeatured: false,
      },
      {
        id: '2',
        shortName: 'event 2',
        country: 'DE',
        city: '',
        longName: '',
        currencies: ['EUR'],
        featured: false,
        superFeatured: false,
      },
    ],
  })

  it('should return the name of the event with the matching id', () => {
    expect(getEventName('1')).toEqual('event 1')
    expect(getEventName('2')).toEqual('event 2')
  })

  it('should return the eventId if no matching event was found', () => {
    expect(getEventName('3')).toEqual('3')
  })
})
