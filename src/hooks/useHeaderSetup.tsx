import { useEffect } from 'react'
import { Header } from '../components'
import { HeaderConfig } from '../components/header/Header'
import { useNavigation } from './useNavigation'

export const useHeaderSetup = (headerConfig: HeaderConfig) => {
  const setOptions = useNavigation().setOptions

  useEffect(() => {
    setOptions({ header: () => <Header {...headerConfig} /> })
  }, [headerConfig, setOptions])
}
