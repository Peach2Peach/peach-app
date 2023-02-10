import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getErrorsInField } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSignMessageSetup = () => {
  const [address, messageSignature, setMessageSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.messageSignature, state.setMessageSignature],
    shallow,
  )
  const navigation = useNavigation()
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)
  const message = address ? getMessageToSignForAddress(account.publicKey, address) : undefined
  const signatureRules = useMemo(
    () => ({
      signature: [address, message],
      required: true,
    }),
    [address, message],
  )
  const [signature, setSignature, signatureValid, signatureError] = useValidatedState(
    messageSignature || '',
    signatureRules,
  )

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

  useEffect(() => {
    if (!address) navigation.replace('payoutAddress')
  }, [address, navigation])

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
