import { ReactElement, useCallback, useContext, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '../../../hooks'
import { getBuyOfferFromContract } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { toShortDateFormat } from '../../../utils/date'
import i18n from '../../../utils/i18n'
import { isSellOffer, offerIdToHex } from '../../../utils/offer'
import { PeachWSContext } from '../../../utils/peachAPI/websocket'

type View = 'seller' | 'buyer'

export const useContractSummarySetup = (contract: Contract) => {
  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const offer = useMemo(() => getBuyOfferFromContract(contract), [contract])
  const view: View = !!offer && isSellOffer(offer) ? 'seller' : 'buyer'
  const [unreadMessages, setUnreadMessages] = useState(contract.unreadMessages)

  const finishedDate = contract?.paymentConfirmed
  const subtitle
    = contract && offer
      ? isTradeComplete(contract)
        ? i18n(
          'yourTrades.offerCompleted.subtitle',
          offerIdToHex(offer.id as Offer['id']),
          finishedDate ? toShortDateFormat(finishedDate) : '',
        )
        : i18n('yourTrades.tradeCanceled.subtitle')
      : ''

  useFocusEffect(
    useCallback(() => {
      const messageHandler = async (message: Message) => {
        if (!contract) return
        if (!message.message || message.roomId !== `contract-${contract.id}`) return

        setUnreadMessages((messages) => messages + 1)
      }
      const unsubscribe = () => {
        ws.off('message', messageHandler)
      }

      if (!ws.connected) return unsubscribe

      ws.on('message', messageHandler)

      return unsubscribe
    }, [contract, ws.connected]),
  )

  return {
    offer,
    subtitle,
    unreadMessages,
    view,
    navigation,
  }
}
