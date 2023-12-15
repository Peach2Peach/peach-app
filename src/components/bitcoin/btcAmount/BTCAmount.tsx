import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Icon } from '../../Icon'
import { PeachText } from '../../text/PeachText'
import { MixedLetterSpacingText } from './components/MixedLetterSpacingText'

type Props = ComponentProps & {
  amount: number
  size: 'extra large' | 'large' | 'medium' | 'small' | 'x small'
  showAmount?: boolean
  white?: boolean
}

const styles = {
  'x small': {
    container: tw`w-120px h-9px`,
    contentContainer: undefined,
    iconContainer: tw`w-14px h-14px`,
    icon: tw`w-10.5px h-10.5px`,
    textContainer: tw`pt-3px gap-2px`,
    amount: tw`text-15px leading-20px`,
    sats: tw`text-10px leading-15px pb-2px`,
  },
  small: {
    container: tw`w-135px h-10px`,
    contentContainer: undefined,
    iconContainer: tw`w-16px h-16px`,
    icon: tw`w-12px h-12px`,
    textContainer: tw`pt-3px gap-2px`,
    amount: tw`text-17px leading-23px`,
    sats: tw`text-12px leading-18px pb-2px`,
  },
  medium: {
    container: tw`w-179px h-13px`,
    contentContainer: tw`gap-2px`,
    iconContainer: tw`w-20px h-20px`,
    icon: tw`w-15px h-15px`,
    textContainer: tw`gap-3px pt-4px`,
    amount: tw`text-22px leading-29px`,
    sats: tw`text-16px leading-24px pb-2px`,
  },
  large: {
    container: tw`w-211px h-16px`,
    contentContainer: tw`gap-2px`,
    iconContainer: tw`w-26px h-26px`,
    icon: tw`w-19.5px h-19.5px`,
    textContainer: tw`gap-4px pt-4px`,
    amount: tw`text-26px leading-35px`,
    sats: tw`text-18px leading-27px pb-3px`,
  },
  'extra large': {
    container: tw`w-242px h-18px`,
    contentContainer: tw`gap-2px`,
    iconContainer: tw`w-32px h-32px`,
    icon: tw`w-24px h-24px`,
    textContainer: tw`gap-4px pt-4px`,
    amount: tw`text-30px leading-40px`,
    sats: tw`text-20px leading-30px pb-3px`,
    hiddenAmount: tw`flex-row items-center justify-between px-2px h-40px w-[168.5px]`,
  },
}

export const BTCAmount = ({ amount, size, white = false, showAmount = true, style }: Props) => (
  <View style={[style, tw`justify-center`, styles[size].container]}>
    <View style={[tw`flex-row items-center justify-end -my-10`, styles[size].contentContainer]}>
      <View style={[tw`items-center justify-center`, styles[size].iconContainer]}>
        <Icon id={white ? 'bitcoinTransparent' : 'bitcoinLogo'} style={[styles[size].icon]} />
      </View>
      <View style={[tw`flex-row`, !showAmount ? tw`items-end` : tw`items-baseline`, styles[size].textContainer]}>
        {showAmount ? (
          <MixedLetterSpacingText
            style={[tw`items-center text-center font-courier-prime-bold`, styles[size].amount]}
            value={amount}
            white={white}
          />
        ) : (
          <View style={styles['extra large'].hiddenAmount}>
            {[...Array(9)].map((_, i) => (
              <Icon key={i} id="ellipse" size={8} />
            ))}
          </View>
        )}
        <View style={tw`justify-center`}>
          <PeachText style={[tw`font-baloo-medium`, white && tw`text-primary-background-light`, styles[size].sats]}>
            {i18n('currency.SATS')}
          </PeachText>
        </View>
      </View>
    </View>
  </View>
)
