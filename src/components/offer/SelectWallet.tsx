import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Label, OnOffLabel, TextLabel } from '../text'

type Props = ComponentProps & {
  type: 'refund' | 'payout'
}

export const SelectWallet = ({ type, style }: Props) => {
  const navigation = useNavigation()
  const [peachWalletActive, setPeachWalletActive, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddressLabel],
    shallow,
  )
  const selectPeachWallet = () => setPeachWalletActive(true)
  const selectCustomWallet = () => setPeachWalletActive(false)
  const goToSelectWallet = () => {
    navigation.navigate('payoutAddress', { type })
  }

  return (
    <View style={[tw`flex-row items-stretch gap-1`, style]}>
      {payoutAddressLabel ? (
        <OnOffLabel active={peachWalletActive} onPress={selectPeachWallet}>
          {i18n('peachWallet')}
        </OnOffLabel>
      ) : (
        <TextLabel onPress={selectPeachWallet}>{i18n('peachWallet')}</TextLabel>
      )}
      {payoutAddressLabel ? (
        <OnOffLabel active={!peachWalletActive} onPress={selectCustomWallet}>
          {payoutAddressLabel}
        </OnOffLabel>
      ) : (
        <Label testID="goToPayoutAddress" style={tw`border-primary-main`} onPress={goToSelectWallet}>
          <Icon id="plus" style={tw`w-3 h-3`} color={tw`text-primary-main`.color} />
        </Label>
      )}
    </View>
  )
}
