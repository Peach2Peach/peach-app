import { meetupEventsStorage } from '../../store/meetupEventsStore'

export const getEventName = (eventId: string) => {
  const meetups = (meetupEventsStorage.getMap('meetupEvents') as MeetupEvent[]) || []
  return meetups.find(({ id }) => eventId === id)?.shortName || eventId
}
