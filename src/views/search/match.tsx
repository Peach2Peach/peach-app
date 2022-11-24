import i18n from '../../utils/i18n'

import { account, getPaymentDataByType } from '../../utils/account'
import { checkRefundPSBT, signPSBT } from '../../utils/bitcoin'
import { getRandom } from '../../utils/crypto'
import { error, info } from '../../utils/log'
import { getPaymentDataByMethod, saveOffer } from '../../utils/offer'
import { encryptPaymentData } from '../../utils/paymentMethod'
import { matchOffer, patchOffer } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp'
import { decryptSymmetricKey } from '../contract/helpers/parseContract'
import DifferentCurrencyWarning from '../../overlays/DifferentCurrencyWarning'
import React, { useContext } from 'react'
import { PaymentDataMissing } from '../../messageBanners/PaymentDataMissing'
import { StackNavigation } from '../../utils/navigation'
import { Level, MessageContext } from '../../contexts/message'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '../../hooks/useNavigation'
import { OverlayContext } from '../../contexts/overlay'

import { useMatchStore } from '../../components/matches/store'
import { useRoute } from '@react-navigation/native'

const messageLevels: Record<string, Level> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

const createEncryptedKey = async (match: Match) =>
  signAndEncrypt((await getRandom(256)).toString('hex'), [account.pgp.publicKey, match.user.pgpPublicKey].join('\n'))

const handleMissingPaymentData = (
  offer: BuyOffer | SellOffer,
  currency: Currency,
  paymentMethod: PaymentMethod,
  updateMessage: (value: MessageState) => void,
  navigation: StackNavigation,
  routeParams: Readonly<{
    offer: BuyOffer | SellOffer
    hasMatches?: boolean | undefined
  }>,
  // eslint-disable-next-line max-params
) => {
  error('Payment data could not be found for offer', offer.id)
  const openAddPaymentMethodDialog = () => {
    updateMessage({ template: null, level: 'ERROR' })
    const existingPaymentMethodsOfType = getPaymentDataByType(paymentMethod).length + 1
    const label = i18n(`paymentMethod.${paymentMethod}`) + ' #' + existingPaymentMethodsOfType

    navigation.push('paymentDetails', {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [currency],
        country: /giftCard/u.test(paymentMethod) ? (paymentMethod.split('.').pop() as Country) : undefined,
      },
      origin: ['search', routeParams],
    })
  }
  updateMessage({
    template: <PaymentDataMissing {...{ openAddPaymentMethodDialog }} />,
    level: 'ERROR',
  })
}

const createEncryptedPaymentData = async (match: Match, paymentDataForMethod: PaymentData) => {
  const [symmetricKey] = await decryptSymmetricKey(
    match.symmetricKeyEncrypted,
    match.symmetricKeySignature,
    match.user.pgpPublicKey,
  )

  return encryptPaymentData(paymentDataForMethod, symmetricKey)
}

const handleRefundTx = async (offer: BuyOffer | SellOffer, result: MatchResponse) => {
  if (offer.type === 'ask' && result.refundTx) {
    let refundTx = offer.refundTx
    const { isValid, psbt } = checkRefundPSBT(result.refundTx, offer)
    if (isValid && psbt) {
      const signedPSBT = signPSBT(psbt, offer, false)
      const [patchOfferResult] = await patchOffer({
        offerId: offer.id!,
        refundTx: signedPSBT.toBase64(),
      })
      if (patchOfferResult) refundTx = psbt.toBase64()
    }
    saveOffer({
      ...offer,
      doubleMatched: true,
      contractId: result.contractId,
      refundTx,
    })
    return result.contractId
  }
  return Promise.resolve(undefined)
}

const handleError = (err: APIError | null, updateMessage: (value: MessageState) => void) => {
  error('Error', err)
  if (err?.error) {
    const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
    updateMessage({
      msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
      level: messageLevels[err?.error] || 'ERROR',
    })
  }
}

const generateMatchOfferData = async (
  offer: BuyOffer | SellOffer,
  match: Match,
  selectedCurrency: Currency,
  selectedPaymentMethod: PaymentMethod,
  // eslint-disable-next-line max-params
) => {
  let encryptedSymmmetricKey
  let encryptedPaymentData
  if (offer.type === 'bid') {
    encryptedSymmmetricKey = await createEncryptedKey(match)
  } else {
    const paymentDataForMethod = getPaymentDataByMethod(offer, selectedPaymentMethod)
    if (!paymentDataForMethod) {
      return Promise.resolve(undefined)
    }
    encryptedPaymentData = await createEncryptedPaymentData(match, paymentDataForMethod)
  }
  return {
    offerId: offer.id!,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: encryptedSymmmetricKey?.encrypted,
    symmetricKeySignature: encryptedSymmmetricKey?.signature,
    paymentDataEncrypted: encryptedPaymentData?.encrypted,
    paymentDataSignature: encryptedPaymentData?.signature,
    hashedPaymentData: offer.paymentData[selectedPaymentMethod]!.hash,
  }
}

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency?: Currency,
  selectedPaymentMethod?: PaymentMethod,
  // eslint-disable-next-line max-params
) => {
  if (!offer?.id) {
    throw new Error('No offer id')
  }
  if (!selectedCurrency || !selectedPaymentMethod) {
    throw new Error('Missing values')
  }

  const matchOfferData = await generateMatchOfferData(offer, match, selectedCurrency, selectedPaymentMethod)
  if (!matchOfferData) throw new Error('Missing paymentdata')

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  throw new Error(err?.error)
}

export const updateMatchedStatus = (
  isMatched: boolean,
  oldQueryData: GetMatchesResponse | undefined,
  matchingOfferId: string,
  offer: BuyOffer | SellOffer,
  // eslint-disable-next-line max-params
) => {
  if (oldQueryData) {
    const newMatches = oldQueryData.matches.map((m) => ({
      ...m,
      matched: m.offerId === matchingOfferId ? isMatched : m.matched,
    }))
    const matchedOffers = newMatches.filter((m) => m.matched).map((m) => m.offerId)
    saveOffer({
      ...offer,
      matched: matchedOffers,
    })
    return { ...oldQueryData, matches: newMatches }
  }
  return oldQueryData
}

export const useMatchOffer = (offer: BuyOffer | SellOffer, match: Match) => {
  const matchingOfferId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const routeParams = useRoute().params as Readonly<{ offer: BuyOffer | SellOffer; hasMatches?: boolean }>
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const { selectedCurrency, selectedPaymentMethod, currentPage } = useMatchStore()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['matches', offer.id, currentPage])
      const previousData = queryClient.getQueryData<GetMatchesResponse>(['matches', offer.id, currentPage])
      queryClient.setQueryData(['matches', offer.id, currentPage], (oldQueryData: GetMatchesResponse | undefined) =>
        updateMatchedStatus(true, oldQueryData, matchingOfferId, offer),
      )
      if (!offer.meansOfPayment[selectedCurrency]?.includes(selectedPaymentMethod)) {
        updateOverlay({
          content: <DifferentCurrencyWarning currency={selectedCurrency} paymentMethod={selectedPaymentMethod} />,
          showCloseButton: false,
          showCloseIcon: false,
        })
      }

      return { previousData }
    },
    mutationFn: () => matchFn(match, offer, selectedCurrency, selectedPaymentMethod),
    onError: (err: APIError | null | 'Missing values' | 'Missing paymentdata' | 'No offer id', _hero, context) => {
      if (err === 'Missing values') {
        error(
          'Match data missing values.',
          `selectedCurrency: ${selectedCurrency}`,
          `selectedPaymentMethod: ${selectedPaymentMethod}`,
        )
      } else if (err === 'Missing paymentdata' && selectedCurrency && selectedPaymentMethod) {
        handleMissingPaymentData(offer, selectedCurrency, selectedPaymentMethod, updateMessage, navigation, routeParams)
      } else if (err !== 'No offer id' && err !== 'Missing paymentdata') {
        handleError(err, updateMessage)
      }
      queryClient.setQueryData(['matches', offer.id, currentPage], context?.previousData)
    },
    onSuccess: async (result: MatchResponse) => {
      const contractId = await handleRefundTx(offer, result)
      if (contractId) {
        info('Search.tsx - _match', `navigate to contract ${contractId}`)
        navigation.replace('contract', { contractId })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['matches', offer.id, currentPage])
    },
  })
}
