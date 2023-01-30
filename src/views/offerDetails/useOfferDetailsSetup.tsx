import { useCallback, useContext, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { useMatchStore } from '../../components/matches/store'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useNavigation, useRoute } from '../../hooks'
import { useConfirmEscrowOverlay } from '../../overlays/useConfirmEscrowOverlay'
import { useHandleContractOverlays } from '../../overlays/useHandleContractOverlays'
import { getChatNotifications } from '../../utils/chat'
import { getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getOffer, isSellOffer, saveOffer } from '../../utils/offer'

export const useOfferDetailsSetup = () => {
  const route = useRoute<'offer'>()
  const offerId = route.params.offerId
  const navigation = useNavigation()
  const showEscrowConfirmOverlay = useConfirmEscrowOverlay()
  const handleContractOverlays = useHandleContractOverlays()
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)
  const [offer, setOffer] = useState(() => getOffer(offerId))
  const view = !!offer && isSellOffer(offer) ? 'seller' : 'buyer'
  const [contract, setContract] = useState(() => (offer?.contractId ? getContract(offer.contractId) : null))
  const [contractId, setContractId] = useState(offer?.contractId)

  const saveAndUpdate = (offerData: BuyOffer | SellOffer) => {
    saveOffer(offerData)
    setOffer(offerData)
  }

  useFocusEffect(
    useCallback(
      getOfferDetailsEffect({
        offerId,
        interval: 30 * 1000,
        onSuccess: (result) => {
          const updatedOffer = {
            ...(offer || {}),
            ...result,
          }
          saveAndUpdate(updatedOffer)

          if (result.online && result.matches.length && !result.contractId) {
            info('useOfferDetailsSetup - getOfferDetailsEffect', `navigate to search ${updatedOffer.id}`)
            matchStoreSetOffer(updatedOffer)
            navigation.replace('search')
          } else if (isSellOffer(updatedOffer) && result.tradeStatus === 'fundingAmountDifferent') {
            showEscrowConfirmOverlay(updatedOffer)
          }
          if (result.contractId) setContractId(result.contractId)
        },
        onError: (err) => {
          error('Could not fetch offer information for offer', offerId)
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        },
      }),
      [offerId],
    ),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          const c = {
            ...getContract(result.id),
            ...result,
          }
          setContract(c)

          if (!result.paymentMade && !result.canceled) {
            info('useOfferDetailsSetup - getContractEffect', `navigate to contract ${result.id}`)
            navigation.replace('contract', { contractId: result.id })
          }
          updateAppContext({
            notifications: getChatNotifications(),
          })
          handleContractOverlays(c, view)
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          }),
      }),
      [contractId],
    ),
  )

  return {
    offer,
    contract,
  }
}
