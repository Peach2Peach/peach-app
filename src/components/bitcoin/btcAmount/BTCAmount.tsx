import { StyleProp, View, ViewStyle } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Icon } from '../../Icon'
import { PeachText } from '../../text/PeachText'
import { getDisplayAmount } from './getDisplayAmount'

type Props = {
  amount: number
  size: 'large' | 'medium' | 'small'
  showAmount?: boolean
  white?: boolean
  style?: StyleProp<ViewStyle>
}

const styles = {
  small: {
    container: tw`w-130px h-10px`,
    iconContainer: tw`p-2px`,
    iconSize: 12,
    textContainer: tw`gap-2px`,
    amount: tw`-my-[10px] subtitle-2`,
    ellipseSize: 5,
  },
  medium: {
    container: tw`w-152px h-13px`,
    iconContainer: tw`p-[2.5px]`,
    iconSize: 15,
    textContainer: tw`gap-5px`,
    amount: tw`-my-[13px] subtitle-1`,
    ellipseSize: 6,
  },
  large: {
    container: tw`w-196px h-18px`,
    iconContainer: tw`p-1`,
    iconSize: 24,
    textContainer: tw`gap-5px`,
    amount: tw`subtitle-0`,
    ellipseSize: 8,
  },
}

export function BTCAmount ({ amount, size, white = false, showAmount = true, style }: Props) {
  const [greyText, blackText] = getDisplayAmount(amount)
  const textStyle = [styles[size].amount, white && tw`text-primary-background-light`]
  return (
    <View style={[style, tw`flex-row items-center justify-between`, styles[size].container]}>
      <View style={[tw`shrink-0`, styles[size].iconContainer]}>
        <Icon id={white ? 'bitcoinTransparent' : 'bitcoinLogo'} size={styles[size].iconSize} />
      </View>

      <View style={[tw`flex-row items-center flex-1`, styles[size].textContainer]}>
        {!showAmount ? (
          <View style={tw`flex-row items-center justify-between flex-1 pl-1px`}>
            {[...Array(9)].map((_, i) => (
              <Icon key={i} id="ellipse" size={styles[size].ellipseSize} />
            ))}
          </View>
        ) : (
          <View style={tw`flex-row items-center justify-end flex-1`}>
            <PeachText style={[tw`text-right opacity-10`, textStyle]}>{greyText}</PeachText>
            <PeachText style={[tw`text-right`, textStyle]}>{blackText}</PeachText>
          </View>
        )}
        <PeachText style={textStyle}>{`${i18n('currency.SATS')}`}</PeachText>
      </View>
    </View>
  )
}
