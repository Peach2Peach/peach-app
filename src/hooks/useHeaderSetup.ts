import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { HeaderConfig, useHeaderState } from '../components/header/store'

export const useHeaderSetup = (headerConfig: HeaderConfig) => {
  const setHeaderState = useHeaderState((state) => state.setHeaderState)
  useFocusEffect(
    useCallback(() => {
      setHeaderState(headerConfig)
    }, [headerConfig, setHeaderState]),
  )
}
