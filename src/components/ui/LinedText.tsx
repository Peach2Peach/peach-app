import React, { ReactElement } from 'react'
import { View, Text } from 'react-native'
import tw from '../../styles/tailwind'

type LinedTextProps = ComponentProps & {
  text: string
}

/**
 * @description Component to display text with lines at both sides
 * @param props Component properties
 * @param [props.style] css style object
 * @param [props.text] text of the section
 * @example
 * <LinedText
 *   style={tw`mt-4`}
 *   text={'Hello'}>
 * </LinedText>
 */
export const LinedText = ({ style, text }: LinedTextProps): ReactElement => (
  <View style={[tw`flex-row items-center justify-center my-3 mx-5`, style]}>
    <View style={tw`flex-1 bg-black-5 h-0.1`} />
    <Text style={tw`body-m text-black-5 px-2`}>{text}</Text>
    <View style={tw`flex-1 bg-black-5 h-0.1`} />
  </View>
)

export default LinedText
