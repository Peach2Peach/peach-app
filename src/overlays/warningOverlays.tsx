import { ReactElement, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'

import i18n from '../utils/i18n'
import { Backups } from './warning/Backups'

type WarningContent = {
  title: string
  content: () => ReactElement
}
type WarningContentWithAction = WarningContent & {
  action: Action
}
const warningOverlays: Record<string, WarningContent> = {
  backups: {
    title: i18n('warning.backup.title'),
    content: Backups,
  },
}
export type WarningType = keyof typeof warningOverlays

export const useWarningOverlay = (id: WarningType): WarningContentWithAction => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => {
    updateOverlay({
      visible: false,
    })
  }
  const actions: Record<WarningType, Action> = {
    backups: {
      icon: 'arrowRightCircle',
      label: i18n('warning.backup.action'),
      callback: () => {
        navigation.navigate('backups')
        closeOverlay()
      },
    },
  }

  return {
    ...warningOverlays[id],
    action: actions[id],
  }
}
