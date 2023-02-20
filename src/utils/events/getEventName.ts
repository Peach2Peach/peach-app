import { sessionStorage } from '../session'

export const getEventName = (eventId: string) => {
  const meetups = sessionStorage.getMap('meetupEvents') as MeetupEvent[]
  return meetups.find(({ id }) => eventId === id)?.shortName || eventId
}
