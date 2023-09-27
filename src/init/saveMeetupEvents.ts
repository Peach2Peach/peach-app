import { useMeetupEventsStore } from '../store/meetupEventsStore'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import { info } from '../utils/log'
import { peachAPI } from '../utils/peachAPI'

export const saveMeetupEvents = async () => {
  info('Getting meetup events...')
  const { result: events } = await peachAPI.public.events.getEvents({ signal: getAbortWithTimeout(3 * 1000).signal })
  if (events) useMeetupEventsStore.getState().setMeetupEvents(events)
}
