import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { OpenDispute } from '../components/OpenDispute'

/**
 * @description Overlay for opening dispute from chat
 */
export const useOpenDispute = (contractId: string) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const ok = useCallback(async () => {
    closeOverlay()
    navigation.navigate('disputeReasonSelector', { contractId })
  }, [closeOverlay, contractId, navigation])

  const showOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('dispute.openDispute'),
      level: 'WARN',
      content: <OpenDispute />,
      visible: true,
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeOverlay,
      },
      action2: {
        label: i18n('dispute.openDispute'),
        icon: 'alertOctagon',
        callback: ok,
      },
    })
  }, [updateOverlay, closeOverlay, ok])
  return showOverlay
}
