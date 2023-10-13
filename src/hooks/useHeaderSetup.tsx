import { useEffect, useMemo } from 'react'
import { OldHeader } from '../components'
import { HeaderConfig } from '../components/header/Header'
import { useNavigation } from './useNavigation'

/** @deprecated - use Header directly in the screen instead */
export const useHeaderSetup = (headerConfig: HeaderConfig | string) => {
  const setOptions = useNavigation().setOptions

  const props = useMemo(
    () => (typeof headerConfig === 'string' ? { title: headerConfig } : headerConfig),
    [headerConfig],
  )

  useEffect(() => {
    setOptions({ header: () => <OldHeader {...props} /> })
  }, [props, setOptions])
}
