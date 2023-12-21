import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { MSINANHOUR } from '../../constants'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import { peachAPI } from '../../utils/peachAPI'

const getMeetupEventsQuery = async () => {
  const { result: events, error } = await peachAPI.public.events.getEvents()

  if (error) throw new Error(error.error || 'Error fetching events')

  return events
}

export const useMeetupEvents = () => {
  const [meetupEvents, setMeetupEvents, getLastModified] = useMeetupEventsStore(
    (state) => [state.meetupEvents, state.setMeetupEvents, state.getLastModified],
    shallow,
  )
  const { data, isLoading, error } = useQuery({
    queryKey: ['meetupEvents'],
    queryFn: getMeetupEventsQuery,
    placeholderData: meetupEvents.length ? meetupEvents : undefined,
    initialDataUpdatedAt: getLastModified().getTime(),
    staleTime: MSINANHOUR,
    onSuccess: (result) => {
      setMeetupEvents(result as MeetupEvent[])
    },
  })

  return { meetupEvents: data, isLoading, error }
}
