import { View } from 'react-native'
import tw from '../styles/tailwind'
import { FixedHeightText } from './text/FixedHeightText'

type InfoContainerProps = {
  text: string
  icon: JSX.Element
  color?: string
  textColor?: string
  backgroundColor?: string
  enabled?: boolean
}
export const horizontalBadgePadding = 6
export function InfoContainer ({ text, icon, color, textColor, backgroundColor, enabled = true }: InfoContainerProps) {
  const colorStyle = color ?? tw.color(enabled ? 'primary-main' : 'primary-mild-1')
  const textStyle = textColor ?? colorStyle
  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full gap-2px`,
        { backgroundColor, borderColor: colorStyle, paddingHorizontal: horizontalBadgePadding },
      ]}
    >
      <FixedHeightText height={6} style={[tw`subtitle-2 text-10px`, { color: textStyle }]}>
        {text}
      </FixedHeightText>
      {icon}
    </View>
  )
}
