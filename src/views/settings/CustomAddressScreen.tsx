import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Header } from '../../components/Header'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { OpenWallet } from '../../components/bitcoin/OpenWallet'
import { Button } from '../../components/buttons/Button'
import { BitcoinAddressInput } from '../../components/inputs/BitcoinAddressInput'
import { Input } from '../../components/inputs/Input'
import { useClosePopup, useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import { PeachText } from '../../components/text/PeachText'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useValidatedState } from '../../hooks/useValidatedState'
import { ErrorPopup } from '../../popups/ErrorPopup'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'

type Props = {
  isPayout?: boolean
  onSave: (address: string, addressLabel: string) => void
  defaultAddress?: string
  defaultAddressLabel?: string
  showRemoveWallet?: boolean
}

const addressRules = { bitcoinAddress: true, required: true }
const labelRules = { required: true }

export function CustomAddressScreen ({
  isPayout = false,
  onSave,
  defaultAddress,
  defaultAddressLabel,
  showRemoveWallet = false,
}: Props) {
  const [address, setAddress, addressValid, addressErrors] = useValidatedState(defaultAddress || '', addressRules)
  const [addressLabel, setAddressLabel, addressLabelValid, addressLabelErrors] = useValidatedState(
    defaultAddressLabel || '',
    labelRules,
  )
  const isUpdated = address === defaultAddress && addressLabel === defaultAddressLabel
  const save = () => {
    if (addressValid && addressLabelValid) {
      onSave(address, addressLabel)
    }
  }
  return (
    <Screen header={<PayoutAddressHeader isPayout={isPayout} />}>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h6`}>
          {i18n(isPayout ? 'settings.payoutAddress.title' : 'settings.refundAddress.title')}
        </PeachText>
        <Input
          value={addressLabel}
          placeholder={i18n('form.address.label.placeholder')}
          placeholderTextColor={tw.color('black-10')}
          onChangeText={setAddressLabel}
          errorMessage={addressLabelErrors}
        />
        <BitcoinAddressInput onChangeText={setAddress} value={address} errorMessage={addressErrors} />
        {isUpdated && showRemoveWallet ? (
          <View style={tw`gap-2`}>
            <View style={tw`flex-row justify-center gap-1`}>
              <PeachText style={tw`uppercase button-medium`}>{i18n('settings.payoutAddress.success')}</PeachText>
              <Icon id="check" size={20} color={tw.color('success-main')} />
            </View>
            <RemoveWalletButton
              isPayout={isPayout}
              setAddressInput={setAddress}
              setAddressLabelInput={setAddressLabel}
            />
          </View>
        ) : (
          <OpenWallet address={address} />
        )}
      </View>
      <Button
        style={tw`self-center`}
        onPress={save}
        disabled={!address || !addressLabel || !addressValid || !addressLabelValid || isUpdated}
      >
        {i18n(isPayout ? 'settings.payoutAddress.confirm' : 'settings.refundAddress.confirm')}
      </Button>
    </Screen>
  )
}
function PayoutAddressHeader ({ isPayout }: { isPayout: boolean }) {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id={isPayout ? 'payoutAddress' : 'refundAddress'} />)
  return (
    <Header
      title={i18n(isPayout ? 'settings.payoutAddress' : 'settings.refundAddress')}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  )
}
type PopupProps = {
  setAddressInput: (address: string) => void
  setAddressLabelInput: (label: string) => void
  isPayout: boolean
}
function RemoveWalletButton (popupProps: PopupProps) {
  const setPopup = useSetPopup()
  const openRemoveWalletPopup = () => {
    setPopup(<RemoveWalletPopup {...popupProps} />)
  }

  return (
    <TouchableOpacity onPress={openRemoveWalletPopup} style={tw`flex-row justify-center gap-1`}>
      <PeachText style={tw`underline uppercase button-medium`}>{i18n('settings.payoutAddress.removeWallet')}</PeachText>
      <Icon id="trash" size={20} color={tw.color('error-main')} />
    </TouchableOpacity>
  )
}
function RemoveWalletPopup ({ setAddressInput, setAddressLabelInput, isPayout }: PopupProps) {
  const [setCustomAddress, setCustomAddressLabel, setPeachWalletActive] = useSettingsStore(
    (state) =>
      isPayout
        ? [state.setPayoutAddress, state.setPayoutAddressLabel, state.setPayoutToPeachWallet]
        : [state.setRefundAddress, state.setRefundAddressLabel, state.setRefundToPeachWallet],
    shallow,
  )
  const closePopup = useClosePopup()
  const removeWallet = () => {
    setCustomAddress(undefined)
    setCustomAddressLabel(undefined)
    setAddressInput('')
    setAddressLabelInput('')
    setPeachWalletActive(true)
    closePopup()
  }
  return (
    <ErrorPopup
      title={i18n('settings.payoutAddress.popup.title')}
      content={i18n('settings.payoutAddress.popup.content')}
      actions={
        <>
          <PopupAction iconId="trash" label={i18n('settings.payoutAddress.popup.remove')} onPress={removeWallet} />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  )
}
