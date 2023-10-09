import { TouchableOpacity, View } from 'react-native'

import { Icon, RadioButtons, Screen, Text } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSelectWalletSetup } from './hooks/useSelectWalletSetup'

export const SelectWallet = () => {
  const { type, wallets, peachWalletActive, setSelectedWallet, payoutAddress, goToSetRefundWallet, selectAndContinue }
    = useSelectWalletSetup()

  return (
    <Screen header={i18n(`${type}.wallet.select.title`)}>
      <View style={tw`justify-center grow`}>
        <Text>{i18n(`${type}.wallet.select.description`)}</Text>
        <RadioButtons
          style={tw`mt-8`}
          items={wallets}
          selectedValue={peachWalletActive ? 'peachWallet' : 'externalWallet'}
          onButtonPress={setSelectedWallet}
        />
        {!payoutAddress && (
          <TouchableOpacity
            onPress={goToSetRefundWallet}
            style={[
              tw`flex-row items-center justify-between px-4 py-2 mt-2`,
              tw`border-2 border-transparent bg-primary-background-dark rounded-xl`,
            ]}
          >
            <Text style={tw`subtitle-1`}>{i18n(`${type}.wallet.select.setWallet`)}</Text>
            <Icon id="arrowRightCircle" style={tw`w-5 h-5`} color={tw`text-black-2`.color} />
          </TouchableOpacity>
        )}
      </View>
      <Button onPress={selectAndContinue} style={tw`self-center`}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
