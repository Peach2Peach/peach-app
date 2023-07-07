import { useEffect, useMemo } from 'react'
import { Header } from '../components'
import { HeaderConfig } from '../components/header/Header'
import { useNavigation } from './useNavigation'

export const useHeaderSetup = (headerConfig: HeaderConfig | string) => {
  const setOptions = useNavigation().setOptions

  const props = useMemo(
    () => (typeof headerConfig === 'string' ? { title: headerConfig } : headerConfig),
    [headerConfig],
  )

  useEffect(() => {
    setOptions({ header: () => <Header {...props} /> })
  }, [props, setOptions])
}
