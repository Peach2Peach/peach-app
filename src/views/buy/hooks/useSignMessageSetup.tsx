import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation, useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { getMessageToSignForAddress } from '../../../utils/account'
import { useAccountStore } from '../../../utils/account/account'
import { getMessages, isValidBitcoinSignature } from '../../../utils/validation'
import { parseSignature } from '../helpers/parseSignature'

const signatureRules = {
  required: true,
}

export const useSignMessageSetup = () => {
  const navigation = useNavigation()
  const [address, setPayoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.setPayoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const message = useMemo(
    () => (address ? getMessageToSignForAddress(publicKey, address) : undefined),
    [address, publicKey],
  )
  const [signature, setSignature, signatureExists, requiredErrors] = useValidatedState<string>('', signatureRules)

  const signatureValid = useMemo(() => {
    if (!signatureExists) return false
    return isValidBitcoinSignature(message || '', address || '', signature)
  }, [signatureExists, message, address, signature])

  const signatureError = useMemo(() => {
    let errs = requiredErrors
    if (!isValidBitcoinSignature(message || '', address || '', signature)) {
      errs = [...errs, getMessages().signature]
    }
    return errs
  }, [requiredErrors, message, address, signature])

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
