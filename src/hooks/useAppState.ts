import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>()

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return appState
}
