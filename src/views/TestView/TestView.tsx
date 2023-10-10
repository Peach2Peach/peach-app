import { View } from 'react-native'
import { OptionButton, Screen } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'

export const TestView = () => {
  const navigation = useNavigation()
  const goToPeachWalletTesting = () => navigation.navigate('testViewPeachWallet')
  const goToPNTesting = () => navigation.navigate('testViewPNs')

  return (
    <Screen>
      <View style={tw`justify-center gap-4 grow`}>
        <OptionButton onPress={goToPeachWalletTesting}>Peach wallet</OptionButton>
        <OptionButton onPress={goToPNTesting}>Push notifications</OptionButton>
      </View>
    </Screen>
  )
}
