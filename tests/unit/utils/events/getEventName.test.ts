import { meetupEventsStore } from '../../../../src/store/meetupEventsStore'
import { getEventName } from '../../../../src/utils/events'

describe('getEventName', () => {
  meetupEventsStore.getState().meetupEvents = [
    { id: '1', shortName: 'event 1', country: 'DE', city: '', longName: '' },
    { id: '2', shortName: 'event 2', country: 'DE', city: '', longName: '' },
  ]

  it('should return the name of the event with the matching id', () => {
    expect(getEventName('1')).toEqual('event 1')
    expect(getEventName('2')).toEqual('event 2')
  })

  it('should return the eventId if no matching event was found', () => {
    expect(getEventName('3')).toEqual('3')
  })
})
