import { TextStyle, View } from 'react-native'
import { Icon, Text } from '..'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type MixedLetterSpacingTextProps = {
  value: number
  style: (false | TextStyle)[]
  isError: boolean
}

export const MixedLetterSpacingText = ({ value, style, isError }: MixedLetterSpacingTextProps) => {
  const newNum = (value / SATSINBTC).toFixed(8).split('')
  for (let i = newNum.length - 3; i > 0; i -= 3) {
    if (newNum[i] !== '.') {
      newNum.splice(i, 0, ' ')
    }
  }

  const hasFontSize = (s: false | TextStyle): s is TextStyle => s !== false && s?.fontSize !== undefined
  const styleWithFontSize = style.find(hasFontSize)
  const fontSize = styleWithFontSize?.fontSize ?? 22
  const desiredLetterSpacing = {
    whiteSpace: -(fontSize * 0.35),
    dot: -(fontSize * 0.21),
    digit: -(fontSize * 0.075),
  }

  return (
    <Text style={style}>
      {newNum.map((char, index) => {
        const shouldBeBlack5
          = index < newNum.findIndex((c) => c !== '0' && Number(c) > 0) || (value === 0 && index !== newNum.length - 1)
        if (char === '.') {
          return (
            <Text
              key={index}
              style={[
                style,
                shouldBeBlack5 && isError ? tw`text-error-mild` : tw`text-black-5`,
                { letterSpacing: desiredLetterSpacing.dot },
              ]}
            >
              {char}
            </Text>
          )
        } else if (char === ' ') {
          return (
            <Text key={index} style={[style, { letterSpacing: desiredLetterSpacing.whiteSpace }]}>
              {char}
            </Text>
          )
        } else if (char === '0' && shouldBeBlack5) {
          return (
            <Text
              key={index}
              style={[
                style,
                isError ? tw`text-error-mild` : tw`text-black-5`,
                { letterSpacing: desiredLetterSpacing.digit },
              ]}
            >
              {char}
            </Text>
          )
        }
        return (
          <Text
            key={index}
            style={[style, isError && tw`text-error-dark`, { letterSpacing: desiredLetterSpacing.digit }]}
          >
            {char}
          </Text>
        )
      })}
    </Text>
  )
}

type Props = ComponentProps & {
  amount: number
  size: 'extra large' | 'large' | 'medium' | 'small' | 'x small'
  isError?: boolean
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
    sats: tw`text-20px leading-30px pb-4px`,
  },
}

export const BTCAmount = ({ amount, size, isError = false, style }: Props) => (
  <View style={[style, tw`justify-center`, styles[size].container]}>
    <View style={[tw`flex-row items-center justify-end -my-10`, styles[size].contentContainer]}>
      <View style={[tw`items-center justify-center`, styles[size].iconContainer]}>
        <Icon id="bitcoinLogo" style={[styles[size].icon]} />
      </View>
      <View style={[tw`flex-row items-baseline`, styles[size].textContainer]}>
        <MixedLetterSpacingText
          style={[tw`items-center text-center font-courier-prime-bold`, styles[size].amount]}
          value={amount}
          isError={isError}
        />
        <Text style={[tw`items-center font-baloo-medium`, isError && tw`text-error-dark`, styles[size].sats]}>
          {i18n('currency.SATS')}
        </Text>
      </View>
    </View>
  </View>
)
