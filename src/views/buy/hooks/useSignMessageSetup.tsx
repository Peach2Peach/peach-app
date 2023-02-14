import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { MessageContext } from '../../../contexts/message'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { isBuyOffer, saveOffer } from '../../../utils/offer'
import { signMessageToPublish } from '../../../utils/peachAPI'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { getErrorsInField } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSignMessageSetup = () => {
  const route = useRoute<'signMessage'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const { offer } = useOfferDetails(route.params.offerId)
  const [, updateMessage] = useContext(MessageContext)
  const [peachWalletActive, payoutAddressSignature, setPayoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddressSignature, state.setPayoutAddressSignature],
    shallow,
  )
  const [signature, setSignature] = useState(payoutAddressSignature || '')

  const signatureRules = useMemo(
    () =>
      offer && isBuyOffer(offer)
        ? {
          signature: [offer.releaseAddress, offer.message],
          required: true,
        }
        : { required: true },
    [offer],
  )

  const signatureError = useMemo(() => getErrorsInField(signature, signatureRules), [signature, signatureRules])
  const signatureValid = signatureError.length === 0

  const showHelp = useShowHelp('addressSigning')
  useHeaderSetup(
    useMemo(
      () =>
        peachWalletActive
          ? {
            title: i18n('buy.releaseAddress.title'),
            hideGoBackButton: true,
          }
          : {
            title: i18n('buy.addressSigning.title'),
            hideGoBackButton: true,
            icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
          },
      [showHelp, peachWalletActive],
    ),
  )

  const submit = useCallback(
    (sig: string) => {
      setMessageSignature(sig)
    },
    [setMessageSignature],
  )

  useEffect(() => {
    if (!message || !address || !peachWalletActive) return

    const sig = peachWallet.signMessage(message, address)
    submit(sig)
  }, [address, message, peachWalletActive, submit])

  return {
    address,
    message,
    peachWalletActive,
    submit,
    signature,
    setSignature,
    signatureValid,
    signatureError,
  }
}
