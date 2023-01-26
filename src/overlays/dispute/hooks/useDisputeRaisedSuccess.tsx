import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { contract } from '../../../../tests/unit/data/contractData'
import { OpenDispute } from '../components/OpenDispute'
import DisputeRaisedSuccess from '../components/DisputeRaisedSuccess'

/**
 * @description Overlay appearing after raising dispute
 */
export const useDisputeRaisedSuccess = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  const showOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('dispute.opened'),
      level: 'ERROR',
      content: <DisputeRaisedSuccess />,
      visible: true,
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeOverlay,
      },
    })
  }, [updateOverlay, contract])
  return showOverlay
}
