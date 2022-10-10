import NotificationBadge from '@msml/react-native-notification-badge'
import { createContext, Dispatch, ReducerState } from 'react'
import { setSessionItem } from '../utils/session'

let notifications = 0

export const getAppContext = (): AppState => ({
  notifications,
})

const dispatch: Dispatch<AppState> = () => {}

export const AppContext = createContext([{ notifications }, dispatch] as const)

export const setAppContext = (state: ReducerState<any>, newState: Partial<AppState>): AppState => {
  notifications = Math.max(0, newState.notifications ?? notifications)

  NotificationBadge.setNumber(notifications)
  setSessionItem('notifications', notifications)

  return {
    notifications,
  }
}

export default AppContext
