import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

export type MeetupEventsState = {
  meetupEvents: MeetupEvent[]
  lastModified?: Date
}

type MeetupEventsStore = MeetupEventsState & {
  setMeetupEvents: (events: MeetupEvent[]) => void
  getLastModified: () => Date
  getMeetupEvent: (eventId: string) => MeetupEvent | undefined
}

const defaultState: MeetupEventsState = {
  meetupEvents: [],
}
export const meetupEventsStorage = createStorage('meetupEvents')

export const useMeetupEventsStore = create(
  persist<MeetupEventsStore>(
    (set, get) => ({
      ...defaultState,
      setMeetupEvents: (meetupEvents) => set((state) => ({ ...state, meetupEvents, lastModified: new Date() })),
      getLastModified: () => new Date(get().lastModified || 0),
      getMeetupEvent: (eventId) => get().meetupEvents.find(({ id }) => id === eventId),
    }),
    {
      name: 'meetupEvents',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(meetupEventsStorage)),
    },
  ),
)
