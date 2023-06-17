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

// eslint-disable-next-line complexity
export const BTCAmount = ({ amount, size, isError = false, style }: Props) => (
  <View
    style={[
      style,
      tw`justify-center`,
      size === 'x small' && tw`w-120px h-9px`,
      size === 'small' && tw`w-135px h-10px`,
      size === 'medium' && tw`w-179px h-13px`,
      size === 'large' && tw`w-211px h-16px`,
      size === 'extra large' && tw`w-242px h-18px`,
    ]}
  >
    <View
      style={[
        tw`flex-row items-center justify-end -my-10`,
        ['medium', 'large', 'extra large'].includes(size) && tw`gap-2px`,
      ]}
    >
      <View
        style={[
          tw`items-center justify-center`,
          size === 'x small' && tw`w-14px h-14px`,
          size === 'small' && tw`w-16px h-16px`,
          size === 'medium' && tw`w-20px h-20px`,
          size === 'large' && tw`w-26px h-26px`,
          size === 'extra large' && tw`w-32px h-32px`,
        ]}
      >
        <Icon
          id="bitcoinLogo"
          style={[
            size === 'x small' && tw`w-10.5px h-10.5px`,
            size === 'small' && tw`w-12px h-12px`,
            size === 'medium' && tw`w-15px h-15px`,
            size === 'large' && tw`w-19.5px h-19.5px`,
            size === 'extra large' && tw`w-24px h-24px`,
          ]}
        />
      </View>
      <View
        style={[
          tw`flex-row items-baseline`,
          ['x small', 'small'].includes(size) && tw`pt-3px gap-2px`,
          size === 'medium' && tw`pt-4px gap-3px`,
          ['large', 'extra large'].includes(size) && tw`pt-4px gap-4px`,
        ]}
      >
        <MixedLetterSpacingText
          style={[
            tw`items-center text-center font-courier-prime-bold`,
            size === 'x small' && tw`text-15px leading-20px`,
            size === 'small' && tw`text-17px leading-23px`,
            size === 'medium' && tw`text-22px leading-29px`,
            size === 'large' && tw`text-26px leading-35px`,
            size === 'extra large' && tw`text-30px leading-40px`,
          ]}
          value={amount}
          isError={isError}
        />
        <Text
          style={[
            tw`items-center font-baloo-medium`,
            isError && tw`text-error-dark`,
            size === 'x small' && tw`text-10px leading-15px pb-2px`,
            size === 'small' && tw`text-12px leading-18px pb-2px`,
            size === 'medium' && tw`text-16px leading-24px pb-2px`,
            size === 'large' && tw`text-18px leading-27px pb-3px`,
            size === 'extra large' && tw`text-20px leading-30px pb-4px`,
          ]}
        >
          {i18n('currency.SATS')}
        </Text>
      </View>
    </View>
  </View>
)
