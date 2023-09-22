import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { parseSignature } from '../helpers/parseSignature'

export const useSignMessageSetup = () => {
  const navigation = useNavigation()
  const [address, setPayoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.setPayoutAddressSignature],
    shallow,
  )
  const message = address ? getMessageToSignForAddress(account.publicKey, address) : undefined
  const signatureRules = useMemo(
    () => ({
      signature: [address, message],
      required: true,
    }),
    [address, message],
  )
  const [signature, setSignature, signatureValid, signatureError] = useValidatedState<string>('', signatureRules)

  const parseAndSetSignature = (sig: string) => setSignature(parseSignature(sig))

  const showHelp = useShowHelp('addressSigning')
  useHeaderSetup({
    title: i18n('buy.addressSigning.title'),
    icons: [{ ...headerIcons.help, onPress: showHelp }],
  })

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
