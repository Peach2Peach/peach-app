
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import bubble from './bubble.svg'

type BubbleProps = ComponentProps & {
  color?: string,
}

/**
 * @description Component to display a bubble
 * @param props Component properties
 * @param [props.style] css style object
 * @param [props.color] bubble color
 * @example
 * <Bubble
 *   style={tw`mt-4`}
 *   color={tw`text-white-1`.color as string}>
 *   <Text>1</Text>
 * </Bubble>
 */
export const Bubble = ({ children, style, color }: BubbleProps): ReactElement => {
  const SVG = bubble

  return <View style={style}>
    <SVG style={tw`absolute top-0 left-0 w-full h-full`} fill={color || '#888' }/>
    {children}
  </View>
}

export default Bubble