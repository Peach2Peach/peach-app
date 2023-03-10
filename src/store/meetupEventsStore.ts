import { createStore, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
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

export const meetupEventsStore = createStore(
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
      getStorage: () => toZustandStorage(meetupEventsStorage),
    },
  ),
)

export const useMeetupEventsStore = <T>(
  selector: (state: MeetupEventsStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(meetupEventsStore, selector, equalityFn)
