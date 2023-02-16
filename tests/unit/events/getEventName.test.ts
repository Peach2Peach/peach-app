import { getEventName } from '../../../src/utils/events'
import { sessionStorage } from '../../../src/utils/session'

describe('getEventName', () => {
  const meetupEvents = [
    { id: '1', shortName: 'event 1' },
    { id: '2', shortName: 'event 2' },
  ]
  sessionStorage.setMap('meetupEvents', meetupEvents)

  it('should return the name of the event with the matching id', () => {
    expect(getEventName('1')).toEqual('event 1')
    expect(getEventName('2')).toEqual('event 2')
  })

  it('should return the eventId if no matching event was found', () => {
    expect(getEventName('3')).toEqual('3')
  })
})
