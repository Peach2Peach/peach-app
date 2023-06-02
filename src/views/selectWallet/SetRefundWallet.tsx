import { TouchableOpacity, View } from 'react-native'

import { Icon, PrimaryButton, RadioButtons, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSetRefundWalletSetup } from './hooks/useSetRefundWalletSetup'

export default () => {
  const { wallets, peachWalletActive, setSelectedWallet, payoutAddress, goToSetRefundWallet, selectAndContinue }
    = useSetRefundWalletSetup()

  return (
    <View style={tw`justify-between h-full px-8 pb-7`}>
      <View style={tw`justify-center flex-shrink h-full`}>
        <Text>{i18n('setRefundWallet.description')}</Text>
        <RadioButtons
          style={tw`mt-8`}
          items={wallets}
          selectedValue={peachWalletActive ? 'peachWallet' : 'externalWallet'}
          onChange={setSelectedWallet}
        />
        {!payoutAddress && (
          <TouchableOpacity
            onPress={goToSetRefundWallet}
            style={[
              tw`flex-row items-center justify-between px-4 py-2 mt-2`,
              tw`border-2 border-transparent bg-primary-background-dark rounded-xl`,
            ]}
          >
            <Text style={tw`subtitle-1`}>{i18n('refund.wallet.select.setWallet')}</Text>
            <Icon id="arrowRightCircle" style={tw`w-5 h-5`} color={tw`text-black-2`.color} />
          </TouchableOpacity>
        )}
      </View>
      <PrimaryButton testID="select-refund-wallet-confirm" onPress={selectAndContinue} style={tw`self-center`} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
