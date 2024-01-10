import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Header } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { Input } from '../../components/inputs/Input'
import { useSetPopup } from '../../components/popup/Popup'
import { PeachText } from '../../components/text/PeachText'
import { CopyAble } from '../../components/ui/CopyAble'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useValidatedState } from '../../hooks/useValidatedState'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getMessageToSignForAddress } from '../../utils/account/getMessageToSignForAddress'
import { getOfferIdFromContract } from '../../utils/contract/getOfferIdFromContract'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { getMessages } from '../../utils/validation/getMessages'
import { isValidBitcoinSignature } from '../../utils/validation/isValidBitcoinSignature'
import { NewLoadingScreen } from '../loading/LoadingScreen'
import { usePatchReleaseAddress } from './components/usePatchReleaseAddress'

const signatureRules = {
  required: true,
}
export const SignMessage = () => {
  const { params } = useRoute<'signMessage'>()
  if (!params) return <SignMessageForGlobalPreference />

  return 'offerId' in params ? (
    <SignMessageForPatch offerId={params.offerId} />
  ) : (
    <ContractSuspense contractId={params.contractId} />
  )
}

function SignMessageForGlobalPreference () {
  const setPeachWalletActive = useSettingsStore((state) => state.setPeachWalletActive)
  const onSubmit = () => setPeachWalletActive(false)
  return <ScreenContent onSubmit={onSubmit} />
}

function ContractSuspense ({ contractId }: { contractId: string }) {
  const { contract } = useContractDetails(contractId)

  if (!contract) return <NewLoadingScreen />

  return <SignMessageForPatch offerId={getOfferIdFromContract(contract)} contractId={contractId} />
}

function SignMessageForPatch ({ offerId, contractId }: { offerId: string; contractId?: string }) {
  const { mutate: patchPayoutAddress } = usePatchReleaseAddress(offerId, contractId)

  return <ScreenContent onSubmit={patchPayoutAddress} />
}

const signaturePattern = /[a-zA-Z0-9/=+]{88}/u

const parseSignature = (signature: string) => signature.match(signaturePattern)?.pop() || signature

type ScreenContentProps = {
  onSubmit: ({ messageSignature, releaseAddress }: { messageSignature: string; releaseAddress: string }) => void
}

function ScreenContent ({ onSubmit }: ScreenContentProps) {
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

  const submitSignature = () => {
    if (!address || !signatureValid) return
    setPayoutAddressSignature(signature)
    onSubmit({ messageSignature: signature, releaseAddress: address })
    navigation.goBack()
  }

  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    if (clipboard) parseAndSetSignature(clipboard)
  }

  const keyboardOpen = useKeyboard()

  return (
    <Screen header={<SignMessageHeader />}>
      <PeachScrollView style={tw`grow`} contentContainerStyle={tw`justify-center grow`} contentStyle={tw`gap-5`}>
        <TextContainer label={i18n('buy.addressSigning.yourAddress')} value={address} />

        <TextContainer label={i18n('buy.addressSigning.message')} value={message} />

        <Input
          value={signature}
          onChangeText={setSignature}
          label={i18n('buy.addressSigning.signature')}
          placeholder={i18n('buy.addressSigning.signature')}
          errorMessage={signatureError}
          icons={[['clipboard', pasteSignature]]}
        />
      </PeachScrollView>
      {!keyboardOpen && (
        <Button style={tw`self-center`} disabled={!signatureValid} onPress={submitSignature}>
          {i18n('confirm')}
        </Button>
      )}
    </Screen>
  )
}

function TextContainer ({ label, value }: { label: React.ReactNode; value: string | undefined }) {
  return (
    <View>
      <PeachText style={tw`pl-2 input-label`}>{label}</PeachText>
      <View
        style={[
          tw`flex-row items-center justify-between gap-2 px-3 py-2`,
          tw`border rounded-xl`,
          tw`bg-primary-background-light`,
        ]}
      >
        <PeachText style={tw`flex-1 input-text`}>{value}</PeachText>
        <CopyAble value={value || ''} style={tw`w-5 h-5`} color={tw`text-black-100`} />
      </View>
    </View>
  )
}

function SignMessageHeader () {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="addressSigning" />)
  return <Header title={i18n('buy.addressSigning.title')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
