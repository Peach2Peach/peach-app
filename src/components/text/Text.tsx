import { ReactElement } from 'react';
import { Text, TextProps } from 'react-native'
import tw from '../../styles/tailwind'

export type PeachTextProps = ComponentProps & TextProps

/**
 * @description Component to display text with predefined text style
 * @param props Component properties
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @param [props.numberOfLines] number of allowed lines
 * @param [props.ellipsizeMode] where to cut off the text with ...
 * @example
 * <Text style={tw`mt-4`}>
 *   {i18n('form.save')}
 * </Text>
 */
export const PeachText = ({ style, ...props }: TextProps): ReactElement => (
  <Text style={[tw`body-m text-black-1`, style]} allowFontScaling={false} {...props} />
)

export default PeachText
