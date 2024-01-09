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
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { addressRules, labelRules } from './CustomAddress'

type Props = {
  type?: 'refund' | 'payout'
  onSave: (address: string, addressLabel: string) => void
  defaultAddress: string
  defaultAddressLabel: string
  showRemoveWallet?: boolean
}

export function CustomAddressScreen ({
  type,
  onSave,
  defaultAddress,
  defaultAddressLabel,
  showRemoveWallet = false,
}: Props) {
  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [address, setAddress, addressValid, addressErrors] = useValidatedState(defaultAddress, addressRules)
  const [addressLabel, setAddressLabel, addressLabelValid, addressLabelErrors] = useValidatedState(
    defaultAddressLabel,
    labelRules,
  )
  const isUpdated = address === payoutAddress && addressLabel === payoutAddressLabel
  const save = () => {
    if (addressValid && addressLabelValid) {
      onSave(address, addressLabel)
    }
  }
  return (
    <Screen header={<PayoutAddressHeader type={type} />}>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h6`}>
          {i18n(type === 'refund' ? 'settings.refundAddress.title' : 'settings.payoutAddress.title')}
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
            <RemoveWalletButton setAddressInput={setAddress} setAddressLabelInput={setAddressLabel} />
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
        {i18n(type === 'refund' ? 'settings.refundAddress.confirm' : 'settings.payoutAddress.confirm')}
      </Button>
    </Screen>
  )
}
function PayoutAddressHeader ({ type }: { type?: 'refund' | 'payout' }) {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="payoutAddress" />)
  return (
    <Header
      title={i18n(type === 'refund' ? 'settings.refundAddress' : 'settings.payoutAddress')}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  )
}
type PopupProps = {
  setAddressInput: (address: string) => void
  setAddressLabelInput: (label: string) => void
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
function RemoveWalletPopup ({ setAddressInput, setAddressLabelInput }: PopupProps) {
  const [setPayoutAddress, setPayoutAddressLabel, setPeachWalletActive] = useSettingsStore(
    (state) => [state.setPayoutAddress, state.setPayoutAddressLabel, state.setPeachWalletActive],
    shallow,
  )
  const closePopup = useClosePopup()
  const removeWallet = () => {
    setPayoutAddress(undefined)
    setPayoutAddressLabel(undefined)
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
