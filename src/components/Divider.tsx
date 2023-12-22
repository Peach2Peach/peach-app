import { StyleProp, View, ViewStyle } from 'react-native'
import tw from '../styles/tailwind'
import { PeachText } from './text/PeachText'
import { HorizontalLine } from './ui/HorizontalLine'

type Props =
  | ComponentProps & {
      type?: 'heavy' | 'light' | 'error'
      text?: string
      style?: StyleProp<ViewStyle>
    } & (
        | { align?: 'left'; icon?: JSX.Element; iconAlign?: 'left' | 'right' }
        | { align?: 'center'; icon?: undefined; iconAlign?: undefined }
      )

export const Divider = ({ type = 'light', align = 'left', icon, iconAlign = 'left', text, style }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    {!!icon && iconAlign === 'left' && icon}
    {align === 'center' && <HorizontalLine style={[tw`grow`, type === 'error' && tw`bg-error-mild`]} />}
    {!!text && (
      <PeachText
        style={[
          tw`mr-2 text-black-65`,
          align === 'center' && tw`mx-2`,
          tw`md:body-l md:leading-normal`,
          type === 'error' && tw`text-error-main`,
          type === 'heavy' && [tw`h7 text-black-100`, tw`md:h6`],
        ]}
      >
        {text}
      </PeachText>
    )}
    <HorizontalLine style={[tw`grow`, type === 'error' && tw`bg-error-mild`]} />
    {!!icon && iconAlign === 'right' && icon}
  </View>
)
