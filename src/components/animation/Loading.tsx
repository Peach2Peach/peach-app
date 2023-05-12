import Lottie from 'lottie-react-native'
import tw from '../../styles/tailwind'
import { ColorValue } from 'react-native'
const loading = require('../animation/lotties/loading.json')

type Props = ComponentProps & {
  color?: ColorValue
}

/**
 * @description Component to show loader animation
 * @example
 * <Loading
 *   style={tw`mt-4`}
 *   color={tw.color('primary-background-light')}
 * />
 */

export const Loading = ({ style, color }: Props): JSX.Element => (
  <Lottie
    style={[tw`w-20`, style]}
    source={loading}
    autoPlay
    colorFilters={[{ keypath: 'LFCamada de forma 1', color: (color ?? tw.color('primary-main')) as string }]}
  />
)
