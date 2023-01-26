import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { contract } from '../../../../tests/unit/data/contractData'
import { OpenDispute } from '../components/OpenDispute'

/**
 * @description Overlay for opening dispute from chat
 */
export const useOpenDispute = (contractId: string) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  const ok = async () => {
    closeOverlay()
    navigation.navigate('disputeReasonSelector', { contractId })
  }

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
  }, [updateOverlay, contract, navigation])
  return showOverlay
}
