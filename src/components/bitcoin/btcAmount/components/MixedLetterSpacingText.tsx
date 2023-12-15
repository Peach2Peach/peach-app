import { TextStyle } from 'react-native'
import { PeachText } from '../../../text/PeachText'
import { BTCAmountChar } from './BTCAmountChar'
import { getLetterSpacing, getNewNumber } from './helpers'

type Props = {
  value: number
  style: (false | TextStyle)[]
  white: boolean
}

export const MixedLetterSpacingText = ({ value, style, white }: Props) => {
  const newNum = getNewNumber(value)
  const { dot, whiteSpace, digit } = getLetterSpacing(style)

  return (
    <PeachText style={style}>
      {newNum.map((char, index) => {
        const reduceOpacity
          = index < newNum.findIndex((c) => c !== '0' && Number(c) > 0) || (value === 0 && index !== newNum.length - 1)
        const letterSpacing = char === '.' ? dot : char === ' ' ? whiteSpace : digit
        const props = { style, reduceOpacity, white, char, letterSpacing }
        return <BTCAmountChar key={index} {...props} />
      })}
    </PeachText>
  )
}
