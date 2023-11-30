import Lottie from 'lottie-react-native'
import { ColorValue } from 'react-native'
import tw from '../../styles/tailwind'
import loading from '../animation/lotties/loading.json'

type Props = ComponentProps & {
  color?: ColorValue
}

export const Loading = ({ style, color }: Props) => (
  <Lottie
    style={[tw`w-20 h-20`, style]}
    source={loading}
    autoPlay
    colorFilters={[{ keypath: 'main', color: (color ?? tw.color('primary-main')) as string }]}
  />
)
