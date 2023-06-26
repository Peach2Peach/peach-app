import { TextStyle } from 'react-native'
import { hasFontSize } from './hasFontSize'

export const getLetterSpacing = (style: (false | TextStyle)[]) => {
  const styleWithFontSize = style.find(hasFontSize)
  const fontSize = styleWithFontSize?.fontSize ?? 22

  return {
    whiteSpace: -(fontSize * 0.35),
    dot: -(fontSize * 0.21),
    digit: -(fontSize * 0.075),
  }
}
