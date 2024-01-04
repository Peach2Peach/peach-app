import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Header } from '../../components/Header'
import { Screen } from '../../components/Screen'
import { OpenWallet } from '../../components/bitcoin/OpenWallet'
import { Button } from '../../components/buttons/Button'
import { BitcoinAddressInput } from '../../components/inputs/BitcoinAddressInput'
import { Input } from '../../components/inputs/Input'
import { useSetPopup } from '../../components/popup/Popup'
import { PeachText } from '../../components/text/PeachText'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useValidatedState } from '../../hooks/useValidatedState'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getMessageToSignForAddress } from '../../utils/account/getMessageToSignForAddress'
import { getOfferIdFromContract } from '../../utils/contract/getOfferIdFromContract'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isValidBitcoinSignature } from '../../utils/validation/isValidBitcoinSignature'
import { NewLoadingScreen } from '../loading/LoadingScreen'
import { usePatchReleaseAddress } from './components/usePatchReleaseAddress'

const addressRules = { bitcoinAddress: true, blockTaprootAddress: true, required: true }
const labelRules = { required: true }

export const PatchPayoutAddress = () => {
  const { contractId } = useRoute<'patchPayoutAddress'>().params
  const { contract } = useContractDetails(contractId)

  if (!contract) return <NewLoadingScreen />

  return <ScreenContent contract={contract} />
}

function ScreenContent ({ contract }: { contract: Contract }) {
  const navigation = useNavigation()
  const { contractId } = useRoute<'patchPayoutAddress'>().params

  const [payoutAddress, setPayoutAddress, payoutAddressLabel, setPayoutAddressLabel, messageSignature]
    = useSettingsStore(
      (state) => [
        state.payoutAddress,
        state.setPayoutAddress,
        state.payoutAddressLabel,
        state.setPayoutAddressLabel,
        state.payoutAddressSignature,
      ],
      shallow,
    )

  const defaultAddress = contract.releaseAddress
  const [address, setAddress, addressValid, addressErrors] = useValidatedState(defaultAddress, addressRules)

  const defaultLabel = payoutAddress === defaultAddress ? payoutAddressLabel || '' : ''
  const [addressLabel, setAddressLabel, addressLabelValid, addressLabelErrors] = useValidatedState(
    defaultLabel,
    labelRules,
  )

  const isUpdated = address === payoutAddress && addressLabel === payoutAddressLabel
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { mutate: patchPayoutAddress } = usePatchReleaseAddress(getOfferIdFromContract(contract), contractId)

  const save = () => {
    if (addressValid && addressLabelValid) {
      setPayoutAddress(address)
      setPayoutAddressLabel(addressLabel)

      const message = getMessageToSignForAddress(publicKey, address)
      const signatureRequired = !messageSignature || !isValidBitcoinSignature(message, address, messageSignature)

      if (signatureRequired) {
        navigation.replace('signMessage', { contractId })
      } else {
        patchPayoutAddress(
          { releaseAddress: address, messageSignature },
          {
            onSuccess: () => {
              navigation.goBack()
            },
          },
        )
      }
    }
  }

  return (
    <Screen header={<PayoutAddressHeader />}>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h6`}>{i18n('settings.payoutAddress.title')}</PeachText>
        <Input
          value={addressLabel}
          placeholder={i18n('form.address.label.placeholder')}
          placeholderTextColor={tw.color('black-10')}
          onChangeText={setAddressLabel}
          errorMessage={addressLabelErrors}
        />
        <BitcoinAddressInput onChangeText={setAddress} value={address} errorMessage={addressErrors} />
        <OpenWallet address={address} />
      </View>
      <Button
        style={tw`self-center`}
        onPress={save}
        disabled={!address || !addressLabel || !addressValid || !addressLabelValid || isUpdated}
      >
        {i18n('settings.payoutAddress.confirm')}
      </Button>
    </Screen>
  )
}

function PayoutAddressHeader () {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="payoutAddress" />)
  return <Header title={i18n('settings.payoutAddress')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
