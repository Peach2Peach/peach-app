import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { FixedHeightText } from './FixedHeightText'

export const Left = ({
  icon,
  title,
  date,
  replaced = false,
}: {
  icon?: JSX.Element
  title: string
  date: string
  replaced?: boolean
}) => (
  <View style={tw`gap-1`}>
    <FixedHeightText height={17} style={[tw`subtitle-1`, replaced && tw`text-black-3`]}>
      {title}
    </FixedHeightText>

    <View style={tw`flex-row gap-6px`}>
      {replaced ? <Icon id="bitcoinLogo" color={tw`border-black-1`.color} style={tw`w-17px h-17px`} /> : !!icon && icon}
      <FixedHeightText
        style={[tw`body-s text-black-2`, replaced && tw`underline subtitle-2 text-black-1`]}
        height={17}
        onPress={() => {
          if (!replaced) return
          // go to trade here
        }}
        suppressHighlighting={!replaced}
      >
        {date}
      </FixedHeightText>
    </View>
  </View>
)
