import { info } from '../utils/log'
import { getMeetupEvents } from '../utils/peachAPI/public/meetupEvents'
import { sessionStorage } from '../utils/session'

export const saveMeetupEvents = async () => {
  info('Getting meetup events...')
  const parsed = await getMeetupEvents({ timeout: 3 * 1000 })
  sessionStorage.setMap('meetupEvents', parsed[0] as MeetupEvent[])
}
