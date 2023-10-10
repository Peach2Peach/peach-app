import { View } from 'react-native'
import { Loading } from '../../components'
import tw from '../../styles/tailwind'

export const LoadingScreen = () => (
  <View style={tw`items-center justify-center h-full`}>
    <Loading />
  </View>
)
