import { meetupEventsStorage } from '../../../../src/store/meetupEventsStore'
import { getEventName } from '../../../../src/utils/events'

describe('getEventName', () => {
  const eventId = 'abc123'
  const shortName = 'Short Name'
  const meetups = [
    { id: 'def456', shortName: 'Another short Name' },
    { id: eventId, shortName },
  ]
  meetupEventsStorage.setMap('meetupEvents', meetups)

  it('should return the short name of the event matching the provided ID', () => {
    const eventName = getEventName(eventId)
    expect(eventName).toEqual(shortName)
  })

  it('should return the ID when no event matches', () => {
    const nonExistentId = 'ghi789'
    const eventName = getEventName(nonExistentId)
    expect(eventName).toEqual(nonExistentId)
  })
})
