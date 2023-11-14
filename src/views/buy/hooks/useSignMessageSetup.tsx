import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation, useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { getMessageToSignForAddress } from '../../../utils/account'
import { useAccountStore } from '../../../utils/account/account'
import { parseSignature } from '../helpers/parseSignature'

export const useSignMessageSetup = () => {
  const navigation = useNavigation()
  const [address, setPayoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.setPayoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const message = address ? getMessageToSignForAddress(publicKey, address) : undefined
  const signatureRules = useMemo(
    () => ({
      signature: [address, message],
      required: true,
    }),
    [address, message],
  )
  const [signature, setSignature, signatureValid, signatureError] = useValidatedState<string>('', signatureRules)

  const parseAndSetSignature = (sig: string) => setSignature(parseSignature(sig))

  const submit = (sig: string) => {
    setPayoutAddressSignature(sig)
    navigation.goBack()
  }

  return {
    address,
    message,
    submit,
    signature,
    setSignature: parseAndSetSignature,
    signatureValid,
    signatureError,
  }
}
