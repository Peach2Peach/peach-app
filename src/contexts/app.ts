import NotificationBadge from '@msml/react-native-notification-badge'
import { createContext, Dispatch, ReducerState } from 'react'
import { sessionStorage } from '../utils/session'
import { isIOS } from '../utils/system'

let notifications = 0

export const getAppContext = (): AppState => ({
  notifications,
})

const dispatch: Dispatch<AppState> = () => {}

export const AppContext = createContext([{ notifications }, dispatch] as const)

export const setAppContext = (state: ReducerState<any>, newState: Partial<AppState>): AppState => {
  notifications = Math.max(0, newState.notifications ?? notifications)

  if (isIOS()) NotificationBadge.setNumber(notifications)
  sessionStorage.setInt('notifications', notifications)

  return {
    notifications,
  }
}

export default AppContext
