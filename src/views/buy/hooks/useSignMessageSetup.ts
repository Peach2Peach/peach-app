import { useCallback, useContext, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { sha256 } from '../../../utils/crypto'
import { getOffer, isBuyOffer, saveOffer } from '../../../utils/offer'
import { getOfferDetails, signMessageToPublish } from '../../../utils/peachAPI'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'

const signatureRules = {
  required: true,
}
export const useSignMessageSetup = () => {
  const route = useRoute<'signMessage'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const [, updateMessage] = useContext(MessageContext)
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)
  const signatureField = useValidatedState('', signatureRules)
  const [message, setMessage] = useState('')

  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const submit = useCallback(
    async (sig: string) => {
      const [signMessageToPublishResult, signMessageToPublishError] = await signMessageToPublish({
        offerId: route.params.offerId,
        signature: sig,
      })
      if (signMessageToPublishResult) {
        const offer = getOffer(route.params.offerId) as BuyOffer
        const patchedOffer: BuyOffer = {
          ...(offer || {}),
          message,
          messageSignature: sig,
        }
        saveOffer(patchedOffer)
        if (patchedOffer.online) {
          matchStoreSetOffer(patchedOffer)
          navigation.navigate('search')
        }
      } else if (signMessageToPublishError) {
        showErrorBanner(signMessageToPublishError.error)
      }
    },
    [matchStoreSetOffer, message, navigation, route.params.offerId, showErrorBanner],
  )

  useEffect(() => {
    ;(async () => {
      const [offerDetails, err] = await getOfferDetails({ offerId: route.params.offerId })
      if (offerDetails && isBuyOffer(offerDetails)) {
        setMessage(offerDetails.message)
      } else if (err) {
        showErrorBanner(err.error)
      }
    })()
  }, [route, showErrorBanner])

  useEffect(() => {
    if (!peachWalletActive) return
    const peachAccount = getPeachAccount()

    if (!peachAccount) {
      showErrorBanner(new Error('Peach Account not set'))
      return
    }
    const sig = peachAccount.sign(Buffer.from(sha256(message))).toString('hex')
    submit(sig)
  }, [peachWalletActive, message, updateMessage, navigation, submit, showErrorBanner])

  return {
    message,
    peachWalletActive,
    submit,
    signatureField,
  }
}
