import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GetMatchesResponseBody } from '../../../../peach-api/src/@types/api/offerAPI'
import { Match } from '../../../../peach-api/src/@types/match'
import { useNavigation } from '../../../hooks'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { useAccountStore } from '../../../utils/account/account'
import { getRandom } from '../../../utils/crypto/getRandom'
import { error, info } from '../../../utils/log'
import { cleanPaymentData } from '../../../utils/paymentMethod/cleanPaymentData'
import { encryptPaymentData } from '../../../utils/paymentMethod/encryptPaymentData'
import { peachAPI } from '../../../utils/peachAPI'
import { signAndEncrypt } from '../../../utils/pgp/signAndEncrypt'
import { parseError } from '../../../utils/result/parseError'
import { useMessageState } from '../../message/useMessageState'
import { getMatchPrice } from '../utils/getMatchPrice'
import { handleMissingPaymentData } from '../utils/handleMissingPaymentData'
import { useHandleError } from '../utils/useHandleError'

export const useMatchAsBuyer = (offer: BuyOffer, match: Match) => {
  const matchId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const updateMessage = useMessageState((state) => state.updateMessage)
  const handleError = useHandleError()

  const showPopup = useShowAppPopup('offerTaken')

  return useMutation({
    onMutate: async ({ selectedCurrency, paymentData }) => {
      const selectedPaymentMethod = paymentData?.type
      await queryClient.cancelQueries({ queryKey: ['matches', offer.id] })
      await queryClient.cancelQueries({ queryKey: ['matchDetails', offer.id, matchId] })
      const previousData = queryClient.getQueryData<GetMatchesResponseBody>(['matches', offer.id])
      queryClient.setQueryData<Match>(['matchDetails', offer.id, matchId], (old) => {
        if (!old) return old
        return {
          ...old,
          matched: true,
          selectedCurrency,
          selectedPaymentMethod,
        }
      })

      return { previousData }
    },
    mutationFn: async ({
      selectedCurrency,
      paymentData,
    }: {
      selectedCurrency: Currency
      paymentData: PaymentData | undefined
    }) => {
      if (!selectedCurrency || !paymentData) throw new Error('MISSING_VALUES')

      const { result: matchOfferData, error: dataError } = await generateMatchOfferData({
        offer,
        match,
        currency: selectedCurrency,
        paymentData,
      })
      if (!matchOfferData) throw new Error(dataError || 'UNKNOWN_ERROR')
      const { result, error: err } = await peachAPI.private.offer.matchOffer(matchOfferData)
      if (result) {
        return result
      }
      if (err) handleError(err)
      throw new Error('OFFER_TAKEN')
    },
    onError: (err: Error, { selectedCurrency, paymentData }, context) => {
      const selectedPaymentMethod = paymentData?.type
      const errorMsg = parseError(err)

      if (errorMsg === 'MISSING_PAYMENTDATA' && selectedPaymentMethod) {
        handleMissingPaymentData(offer, selectedCurrency, selectedPaymentMethod, updateMessage, navigation)
      } else if (errorMsg === 'OFFER_TAKEN') {
        showPopup()
      } else {
        if (errorMsg === 'MISSING_VALUES') error(
          'Match data missing values.',
          `selectedCurrency: ${selectedCurrency}`,
          `selectedPaymentMethod: ${selectedPaymentMethod}`,
        )
        handleError({ error: errorMsg })
      }
      queryClient.setQueryData(['matches', offer.id], context?.previousData)
    },
    onSuccess: (result: MatchResponse) => {
      if ('contractId' in result && result.contractId) {
        info('Search.tsx - _match', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', offer.id] })
      queryClient.invalidateQueries({ queryKey: ['matchDetails', offer.id, matchId] })
      queryClient.invalidateQueries({ queryKey: ['offerSummaries'] })
      queryClient.invalidateQueries({ queryKey: ['contractSummaries'] })
    },
  })
}

type Params = {
  offer: BuyOffer
  match: Match
  currency: Currency
  paymentData: PaymentData
}

async function generateMatchOfferData ({ offer, match, currency, paymentData }: Params) {
  const paymentMethod = paymentData.type

  const symmetricKey = (await getRandom(256)).toString('hex')
  const accountPubKey = useAccountStore.getState().account.pgp.publicKey
  const { encrypted, signature } = await signAndEncrypt(
    symmetricKey,
    [accountPubKey, match.user.pgpPublicKey].join('\n'),
  )

  const encryptedPaymentData = await encryptPaymentData(cleanPaymentData(paymentData), symmetricKey)
  if (!encryptedPaymentData) return { error: 'PAYMENTDATA_ENCRYPTION_FAILED' }

  return {
    result: {
      offerId: offer.id,
      matchingOfferId: match.offerId,
      price: getMatchPrice(match, paymentMethod, currency),
      premium: match.premium,
      currency,
      paymentMethod,
      instantTrade: match.instantTrade,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    },
  }
}