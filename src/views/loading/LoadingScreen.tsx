import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Loading } from '../../components'

export const LoadingScreen = () => (
  <View style={tw`flex items-center justify-center h-full`}>
    <Loading />
  </View>
)
