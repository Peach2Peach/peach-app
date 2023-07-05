import { useMeetupEventsStore } from '../../store/meetupEventsStore'

export const getEventName = (eventId: string) =>
  useMeetupEventsStore.getState().getMeetupEvent(eventId)?.shortName || eventId
