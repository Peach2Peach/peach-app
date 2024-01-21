import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

export const useMeetupEvents = () =>
  useQuery({
    queryKey: ['meetupEvents'],
    queryFn: async () => {
      const { result: events, error } = await peachAPI.public.events.getEvents()

      if (error || !events) throw new Error(error?.error || 'Error fetching events')

      return events
    },
  })
