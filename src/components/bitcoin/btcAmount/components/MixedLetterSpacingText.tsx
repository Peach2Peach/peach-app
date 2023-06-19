import { TextStyle } from 'react-native'
import { Text } from '../../..'
import { DotText } from './DotText'
import { getLetterSpacing, getNewNumber } from './helpers'
import { WhiteSpaceText } from './WhiteSpaceText'
import { ZeroText } from './ZeroText'

type MixedLetterSpacingTextProps = {
  value: number
  style: (false | TextStyle)[]
  isError: boolean
}

export const MixedLetterSpacingText = ({ value, style, isError }: MixedLetterSpacingTextProps) => {
  const newNum = getNewNumber(value)
  const { dot, whiteSpace, digit } = getLetterSpacing(style)

  return (
    <Text style={style}>
      {newNum.map((char, index) => {
        const shouldBeBlack5
          = index < newNum.findIndex((c) => c !== '0' && Number(c) > 0) || (value === 0 && index !== newNum.length - 1)
        const props = { style, shouldBeBlack5, isError }

        return char === '.' ? (
          <DotText key={index} {...props} letterSpacing={dot} />
        ) : char === ' ' ? (
          <WhiteSpaceText key={index} {...props} letterSpacing={whiteSpace} />
        ) : (
          <ZeroText key={index} {...props} letterSpacing={digit} />
        )
      })}
    </Text>
  )
}
