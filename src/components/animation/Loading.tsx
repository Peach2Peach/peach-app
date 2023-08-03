import Lottie from 'lottie-react-native'
import tw from '../../styles/tailwind'
import { ColorValue } from 'react-native'
const loading = require('../animation/lotties/loading.json')

type Props = ComponentProps & {
  color?: ColorValue
}

export const Loading = ({ style, color }: Props): JSX.Element => (
  <Lottie
    style={[tw`w-20 h-20`, style]}
    source={loading}
    autoPlay
    colorFilters={[{ keypath: 'main', color: (color ?? tw`text-primary-main`.color) as string }]}
  />
)
