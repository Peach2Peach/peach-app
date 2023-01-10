import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { create } from 'twrnc'
interface Tailwind {
  (classes: TemplateStringsArray): ViewStyle & TextStyle & ImageStyle
  md: (classes: TemplateStringsArray) => ViewStyle & TextStyle & ImageStyle
  lg: (classes: TemplateStringsArray) => ViewStyle & TextStyle & ImageStyle
}
const tailwind = create(require('./tailwind.config'))

/**
 * @example [tw`mt-2 text-lg`, tw.md`mt-4 text-xl`, tw.lg`mt-5 text-2xl`]
 */
const tw: Tailwind = (cls) => tailwind(cls)
tw.md = (cls) => {
  const { width, height } = Dimensions.get('window')
  return (width || 0) > 375 && (height || 0) > 690 ? tailwind(cls) : {}
}
tw.lg = (cls) => {
  const { width } = Dimensions.get('window')
  return (width || 0) >= 1200 ? tailwind(cls) : {}
}

export default tw
