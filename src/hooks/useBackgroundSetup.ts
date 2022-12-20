import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { BackgroundConfig, useBackgroundState } from '../components/background/backgroundStore'

export const useBackgroundSetup = (backgroundConfig: BackgroundConfig) => {
  const setBackgroundState = useBackgroundState((state) => state.setBackgroundState)
  useFocusEffect(
    useCallback(() => {
      setBackgroundState(backgroundConfig)
    }, [backgroundConfig, setBackgroundState]),
  )
}
