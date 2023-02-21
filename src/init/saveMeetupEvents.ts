import { meetupEventsStorage } from '../store/meetupEventsStore'
import { info } from '../utils/log'
import { getMeetupEvents } from '../utils/peachAPI/public/meetupEvents'

export const saveMeetupEvents = async () => {
  info('Getting meetup events...')
  const [events] = await getMeetupEvents({ timeout: 3 * 1000 })
  if (events) meetupEventsStorage.setMap('meetupEvents', events)
}
