import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-react-native'
import tw from '../../styles/tailwind'
import { View } from 'react-native'

type Props = ComponentProps & {
  color?: string
}

/**
 * @description Component to show loader animation
 * @param props Component properties
 * @param props.color loader color (peach color by default)
 * @param [props.style] css style object
 * @param [props.color] icon color
 * @example
 * <Loading
 *   style={tw`mt-4`}
 *   color={tw`text-white-1`.color as string}
 * />
 */

export const Loading = ({ style, color }: Props): JSX.Element => (
  <Lottie
    style={[tw`w-20`, style]}
    source={require('../animation/lotties/loading.json')}
    autoPlay
    colorFilters={[{ keypath: 'LFCamada de forma 1', color: color ?? (tw`text-primary-light`.color as string) }]}
  />
)
