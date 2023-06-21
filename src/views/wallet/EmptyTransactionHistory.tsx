import { Image, View } from 'react-native'
import loadingAnimation from '../../assets/animated/logo-rotate.gif'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const EmptyTransactionHistory = () => (
  <View style={tw`items-center justify-center h-full`}>
    <Image source={loadingAnimation} style={tw`w-30 h-30`} resizeMode="contain" />

    <Text style={tw`mt-8 subtitle-1 text-black-2`}>{i18n('wallet.transactionHistory.empty')}</Text>
  </View>
)
