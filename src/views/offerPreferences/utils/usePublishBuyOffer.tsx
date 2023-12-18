import { useMutation } from '@tanstack/react-query'
import { PeachText } from '../../../components/text/PeachText'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import { InfoPopup } from '../../../popups/InfoPopup'
import { useConfigStore } from '../../../store/configStore/configStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { useAccountStore } from '../../../utils/account/account'
import { getMessageToSignForAddress } from '../../../utils/account/getMessageToSignForAddress'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { isPaymentMethod } from '../../../utils/validation/isPaymentMethod'
import { isValidBitcoinSignature } from '../../../utils/validation/isValidBitcoinSignature'
import { peachWallet } from '../../../utils/wallet/setWallet'

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === 'FORBIDDEN' && Array.isArray(errorDetails) && errorDetails.every(isPaymentMethod)

export function usePublishBuyOffer ({
  amount,
  meansOfPayment,
  paymentData,
  maxPremium,
  minReputation,
}: Pick<BuyOfferDraft, 'amount' | 'meansOfPayment' | 'paymentData' | 'maxPremium' | 'minReputation'>) {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const hasSeenGroupHugAnnouncement = useConfigStore((state) => state.hasSeenGroupHugAnnouncement)
  const setPopup = usePopupStore((state) => state.setPopup)
  const showHelp = () =>
    setPopup(<InfoPopup content={<PeachText>{i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')}</PeachText>} />)
  const publicKey = useAccountStore((state) => state.account.publicKey)

  return useMutation({
    mutationFn: async () => {
      const { address: releaseAddress, index } = await peachWallet.getAddress()

      const message = getMessageToSignForAddress(publicKey, releaseAddress)
      const messageSignature = peachWallet.signMessage(message, releaseAddress, index)

      if (!isValidBitcoinSignature(message, releaseAddress, messageSignature)) throw new Error('INAVLID_SIGNATURE')
      const finalizedOfferDraft = {
        type: 'bid' as const,
        amount,
        meansOfPayment,
        paymentData,
        maxPremium,
        minReputation,
        releaseAddress,
        message,
        messageSignature,
      }

      let { result, error: err } = await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft)

      if (err?.error === 'PGP_MISSING') {
        await publishPGPPublicKey()
        const response = await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft)
        result = response.result
        err = response.error
      }
      if (result) {
        return result.id
      }
      throw new Error(err?.error || 'POST_OFFER_ERROR', { cause: err?.details })
    },
    onError: ({ message, cause }: Error) => {
      if (isForbiddenPaymentMethodError(message, cause)) {
        const paymentMethod = cause.pop()
        if (paymentMethod === 'paypal') showHelp()
      } else {
        showErrorBanner(message)
      }
    },
    onSuccess: (offerId) => {
      navigation.reset({
        index: 1,
        routes: [
          { name: 'homeScreen', params: { screen: 'yourTrades' } },
          { name: !hasSeenGroupHugAnnouncement ? 'groupHugAnnouncement' : 'explore', params: { offerId } },
        ],
      })
    },
  })
}