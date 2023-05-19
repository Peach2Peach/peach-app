import { TextStyle, View } from 'react-native'
import { Icon, Text } from '..'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const MixedLetterSpacingText = ({
  value,
  style,
  isError,
}: {
  value: number
  style: (false | TextStyle)[]
  isError: boolean
}) => {
  const newNum = (value / SATSINBTC).toFixed(8).split('')
  for (let i = newNum.length - 3; i > 0; i -= 3) {
    if (newNum[i] !== '.') {
      newNum.splice(i, 0, ' ')
    }
  }

  const hasFontSize = (s: false | TextStyle): s is TextStyle => s !== false && s?.fontSize !== undefined
  const fontSize = style.find(hasFontSize)!.fontSize!
  const desiredLetterSpacing = {
    whiteSpace: -(fontSize * 0.35),
    dot: -(fontSize * 0.21),
    digit: -(fontSize * 0.075),
  }

  return (
    <Text style={[style]}>
      {newNum.map((char, index) => {
        const shouldBeBlack5 = index < newNum.findIndex((c) => c !== '0' && Number(c) > 0)
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
        } else if (char === '0' && index < newNum.findIndex((c) => c !== '0' && Number(c) > 0)) {
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

export const BTCAmount = ({ amount, size, isError = false, style }: Props) => (
  <View style={[tw`flex-row items-center gap-2px`, style]}>
    <Icon
      id="bitcoinLogo"
      style={[
        size === 'extra large' && tw`w-6 h-6 p-2 mr-2px`,
        size === 'large' && tw`w-[19.5px] h-[19.5px] p-[6.5px] mr-2px`,
        size === 'medium' && tw`w-[15px] h-[15px] p-[5px] mr-2px`,
        size === 'small' && tw`w-3 h-3 p-1`,
        size === 'x small' && tw`w-[10.5px] h-[10.5px] p-[3.5px]`,
      ]}
    />
    <View style={tw`flex-row items-baseline pt-1`}>
      <MixedLetterSpacingText
        style={[
          tw`font-bold text-center font-courier-prime`,
          size === 'extra large' && tw`pr-1 text-30px leading-40px`,
          size === 'large' && tw`pr-1 text-26px leading-34px`,
          size === 'medium' && tw`text-22px leading-30px pr-3px`,
          size === 'small' && tw`text-17px leading-23px pr-2px`,
          size === 'x small' && tw`text-15px leading-20px pr-2px`,
        ]}
        value={amount}
        isError={isError}
      />
      <Text
        style={[
          size === 'extra large' && tw`pb-1 pl-1 text-xl leading-30px`,
          size === 'large' && tw`pl-1 text-lg leading-27px pb-3px`,
          size === 'medium' && tw`text-base leading-24px pb-2px pl-3px`,
          size === 'small' && tw`text-3xs leading-18px pb-2px pl-2px`,
          size === 'x small' && tw`text-10px leading-15px pb-2px pl-2px`,
          tw`font-medium text-left font-baloo`,
          isError && tw`text-error-dark`,
        ]}
      >
        {i18n('currency.SATS')}
      </Text>
    </View>
  </View>
)
