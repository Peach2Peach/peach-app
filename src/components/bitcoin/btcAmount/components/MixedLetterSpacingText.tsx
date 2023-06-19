import { TextStyle } from 'react-native'
import { Text } from '../../..'
import { getLetterSpacing, getNewNumber } from './helpers'
import { BTCAmountChar } from './BTCAmountChar'

type Props = {
  value: number
  style: (false | TextStyle)[]
  isError: boolean
}

export const MixedLetterSpacingText = ({ value, style, isError }: Props) => {
  const newNum = getNewNumber(value)
  const { dot, whiteSpace, digit } = getLetterSpacing(style)

  return (
    <Text style={style}>
      {newNum.map((char, index) => {
        const reduceOpacity
          = index < newNum.findIndex((c) => c !== '0' && Number(c) > 0) || (value === 0 && index !== newNum.length - 1)
        const letterSpacing = char === '.' ? dot : char === ' ' ? whiteSpace : digit
        const props = { style, reduceOpacity, isError, char, letterSpacing }
        return <BTCAmountChar key={index} {...props} />
      })}
    </Text>
  )
}
