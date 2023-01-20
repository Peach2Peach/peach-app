import React, { useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'

import Refund from './Refund'

export const useStartRefundOverlay = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  return (sellOffer: SellOffer) =>
    updateOverlay({
      content: <Refund {...{ sellOffer, navigation }} />,
      visible: true,
    })
}
