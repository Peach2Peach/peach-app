import { Image, View } from 'react-native'
import loadingAnimation from '../../../assets/animated/logo-rotate.gif'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const EmptyTransactionHistory = () => (
  <View style={tw`items-center justify-center h-full gap-8`}>
    <Image source={loadingAnimation} style={tw`w-118px h-130px`} resizeMode="cover" />

    <Text style={tw`subtitle-1 text-black-2`}>{i18n('wallet.transactionHistory.empty')}</Text>
  </View>
)
