import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

/**
 * @description Component to display text with lines at both sides
 * @param props Component properties
 * @param [props.style] css style object
 * @param [props.text] text of the section
 * @example
 * <LinedText
 *   style={tw`mt-4`}>
 * <Text style={tw`px-2 body-m text-black-2`}>text</Text>
 * </LinedText>
 */
export const LinedText = ({ style, children }: ComponentProps): ReactElement => (
  <View style={[tw`flex-row items-center justify-center `, style]}>
    <View style={tw`flex-1 h-px mr-2 bg-black-5`} />
    {children}
    <View style={tw`flex-1 h-px ml-2 bg-black-5`} />
  </View>
)

export default LinedText
