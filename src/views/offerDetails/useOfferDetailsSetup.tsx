import { useCallback, useContext, useEffect, useState } from 'react'

import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import getContractEffect from '../../effects/getContractEffect'
import { useNavigation, useRoute } from '../../hooks'
import { useConfirmEscrowOverlay } from '../../overlays/useConfirmEscrowOverlay'
import { useHandleContractOverlays } from '../../overlays/useHandleContractOverlays'
import { getChatNotifications } from '../../utils/chat'
import { getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getOffer, getRequiredActionCount, isSellOffer, saveOffer } from '../../utils/offer'
import { useQuery, QueryFunctionContext } from '@tanstack/react-query'
import { getOfferQuery } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'

const THIRTY_SECONDS = 30 * 1000

export const useOfferDetailsSetup = () => {
  const route = useRoute<'offer'>()
  const offerId = route.params.offerId
  const navigation = useNavigation()
  const showEscrowConfirmOverlay = useConfirmEscrowOverlay()
  const handleContractOverlays = useHandleContractOverlays()
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)
  const isFocused = useIsFocused()
  const { data: offer, error: offerDetailsError } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: (args: QueryFunctionContext<[string, string], any>) => {
      info('Get offer details for', offerId)
      return getOfferQuery(args)
    },
    refetchInterval: THIRTY_SECONDS,
    initialData: getOffer(offerId),
    enabled: isFocused,
  })
  const view = !!offer && isSellOffer(offer) ? 'seller' : 'buyer'
  const [contract, setContract] = useState(() => (offer?.contractId ? getContract(offer.contractId) : null))
  const [contractId, setContractId] = useState(offer?.contractId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (offerDetailsError) {
      error('Could not fetch offer information for offer', offerId)
      showErrorBanner(offerDetailsError?.error)
    }
  }, [offerDetailsError, offerId, showErrorBanner])

  useEffect(() => {
    if (offer) {
      saveOffer(offer)
      if (offer.online && offer.matches.length && !offer.contractId) {
        info('useOfferDetailsSetup - getOfferDetailsEffect', `navigate to search ${offer.id}`)
        navigation.replace('search', { offerId: offer.id })
      } else if (isSellOffer(offer) && offer.tradeStatus === 'fundingAmountDifferent') {
        showEscrowConfirmOverlay(offer)
      }
      if (offer.contractId) setContractId(offer.contractId)
    }
  }, [navigation, offer, showEscrowConfirmOverlay])

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
            notifications: getChatNotifications() + getRequiredActionCount(),
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
