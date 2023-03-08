import { ReactElement, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'

import i18n from '../utils/i18n'
import { FirstBackup, PaymentBackup } from './warning/Backups'

type WarningContent = {
  title: string
  content: () => ReactElement
}
type WarningContentWithAction = WarningContent & {
  action: Action
}
const warningOverlays: Record<string, WarningContent> = {
  firstBackup: {
    title: i18n('warning.firstBackup.title'),
    content: FirstBackup,
  },
  paymentBackup: {
    title: i18n('warning.paymentBackup.title'),
    content: PaymentBackup,
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
    firstBackup: {
      icon: 'arrowRightCircle',
      label: i18n('warning.firstBackup.action'),
      callback: () => {
        navigation.navigate('backups')
        closeOverlay()
      },
    },
    paymentBackup: {
      icon: 'arrowRightCircle',
      label: i18n('warning.paymentBackup.action'),
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
