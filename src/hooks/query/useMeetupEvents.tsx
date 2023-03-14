import { useQuery } from '@tanstack/react-query'
import shallow from 'zustand/shallow'
import { MSINANHOUR } from '../../constants'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import { getMeetupEvents } from '../../utils/peachAPI/public/meetupEvents'

const getMeetupEventsQuery = async () => {
  const [events, error] = await getMeetupEvents({})

  if (error) throw new Error(error.error)

  return events
}

export const useMeetupEvents = () => {
  const [meetupEvents, setMeetupEvents, getLastModified] = useMeetupEventsStore(
    (state) => [state.meetupEvents, state.setMeetupEvents, state.getLastModified],
    shallow,
  )
  const { data, isLoading, error } = useQuery(['meetupEvents'], getMeetupEventsQuery, {
    initialData: meetupEvents.length ? meetupEvents : undefined,
    initialDataUpdatedAt: getLastModified().getTime(),
    staleTime: MSINANHOUR,
    onSuccess: (result) => {
      setMeetupEvents(result as MeetupEvent[])
    },
  })

  return { meetupEvents: data, isLoading, error }
}
