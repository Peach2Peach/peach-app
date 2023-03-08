import { meetupEventsStore } from '../../store/meetupEventsStore'

export const getEventName = (eventId: string) =>
  meetupEventsStore.getState().getMeetupEvent(eventId)?.shortName || eventId
