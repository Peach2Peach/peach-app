import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Header } from '../../components/Header'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { OpenWallet } from '../../components/bitcoin/OpenWallet'
import { Button } from '../../components/buttons/Button'
import { BitcoinAddressInput } from '../../components/inputs/BitcoinAddressInput'
import { Input } from '../../components/inputs/Input'
import { PopupAction } from '../../components/popup'
import { PeachText } from '../../components/text/PeachText'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useShowHelp } from '../../hooks/useShowHelp'
import { useValidatedState } from '../../hooks/useValidatedState'
import { ErrorPopup } from '../../popups/ErrorPopup'
import { ClosePopupAction } from '../../popups/actions/ClosePopupAction'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'

const addressRules = { bitcoinAddress: true, blockTaprootAddress: true, required: true }
const labelRules = { required: true }

export const CustomAddress = () => {
  const { type } = useRoute<'payoutAddress'>().params || {}
  const navigation = useNavigation()

  const [payoutAddress, setPayoutAddress, payoutAddressLabel, setPayoutAddressLabel, setPeachWalletActive]
    = useSettingsStore(
      (state) => [
        state.payoutAddress,
        state.setPayoutAddress,
        state.payoutAddressLabel,
        state.setPayoutAddressLabel,
        state.setPeachWalletActive,
      ],
      shallow,
    )
  const [address, setAddress, addressValid, addressErrors] = useValidatedState(payoutAddress || '', addressRules)
  const [addressLabel, setAddressLabel, addressLabelValid, addressLabelErrors] = useValidatedState(
    payoutAddressLabel || '',
    labelRules,
  )
  const isUpdated = address === payoutAddress && addressLabel === payoutAddressLabel

  const save = () => {
    if (addressValid && addressLabelValid) {
      const addressChanged = payoutAddress !== address
      setPayoutAddress(address)
      setPayoutAddressLabel(addressLabel)

      if (type === 'refund' && addressChanged) {
        setPeachWalletActive(false)
        navigation.goBack()
      }
    }
  }

  return (
    <Screen header={<PayoutAddressHeader />}>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h6`}>
          {i18n(type === 'refund' ? 'settings.refundAddress.title' : 'settings.payoutAddress.title')}
        </PeachText>
        <Input
          value={addressLabel}
          placeholder={i18n('form.address.label.placeholder')}
          placeholderTextColor={tw.color('black-10')}
          onChange={setAddressLabel}
          errorMessage={addressLabelErrors}
        />
        <BitcoinAddressInput onChange={setAddress} value={address} errorMessage={addressErrors} />
        {isUpdated ? (
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

function PayoutAddressHeader () {
  const { type } = useRoute<'payoutAddress'>().params || {}
  const showHelp = useShowHelp('payoutAddress')
  const title = {
    refund: 'settings.refundAddress',
    payout: 'settings.payoutAddress',
  }
  return <Header title={i18n(title[type || 'payout'])} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
type PopupProps = {
  setAddressInput: (address: string) => void
  setAddressLabelInput: (label: string) => void
}

function RemoveWalletButton (popupProps: PopupProps) {
  const setPopup = usePopupStore((state) => state.setPopup)
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
  const closePopup = usePopupStore((state) => state.closePopup)
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
      content={<PeachText>{i18n('settings.payoutAddress.popup.content')}</PeachText>}
      actions={
        <>
          <PopupAction iconId="trash" label={i18n('settings.payoutAddress.popup.remove')} onPress={removeWallet} />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  )
}
