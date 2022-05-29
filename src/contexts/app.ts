import { createContext, Dispatch, ReducerState } from 'react'

let notifications = 0

export const getAppContext = (): AppState => ({
  notifications
})

const dispatch: Dispatch<AppState> = () => {}

export const AppContext = createContext([
  { notifications },
  dispatch
] as const)

export const setAppContext = (state: ReducerState<any>, newState: Partial<AppState>): AppState => {
  notifications = Math.max(0, newState.notifications ?? notifications)
  return {
    notifications
  }
}


export default AppContext