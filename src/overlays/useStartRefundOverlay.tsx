import React, { useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'

import Refund from './Refund'

export const useStartRefundOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  return (sellOffer: SellOffer) =>
    updateOverlay({
      content: <Refund {...{ sellOffer }} />,
      visible: true,
    })
}
