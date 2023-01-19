import { info } from '../utils/log'
import { getMeetupEvents } from '../utils/peachAPI/public/meetupEvents'
import { sessionStorage } from '../utils/session'

export const saveMeetupEvents = async () => {
  info('Getting meetup events...')
  const parsed = await getMeetupEvents({ timeout: 3 * 1000 })
  const eventsByCountry: Record<string, MeetupEvent[]> = {}
  if (!!parsed[0]) {
    parsed[0].map((event) => {
      if (event.country in eventsByCountry) {
        eventsByCountry[event.country] = [...eventsByCountry[event.country], event]
      } else {
        eventsByCountry[event.country] = [event]
      }
    })
    sessionStorage.setMap('meetupEvents', eventsByCountry)
  }
}
