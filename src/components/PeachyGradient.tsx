import { StyleProp, ViewStyle } from 'react-native'
import Svg, { Defs, NumberProp, Rect, RadialGradient as SVGRadialGradient, Stop } from 'react-native-svg'
import { peachyGradient } from '../utils/layout/peachyGradient'

export type ColorStop = {
  offset: string
  color: string
  opacity: string
}

type Props = {
  colorList: ColorStop[]
  x: NumberProp
  y: NumberProp
  rx: NumberProp
  ry: NumberProp
  style?: StyleProp<ViewStyle>
}

const RadialGradient = ({ colorList, x, y, rx, ry, style }: Props) => (
  <Svg width="100%" height="100%" style={style}>
    <Defs>
      <SVGRadialGradient id="grad" cx={x} cy={y} rx={rx} ry={ry} gradientUnits="userSpaceOnUse">
        {colorList.map(({ offset, color, opacity }, index) => (
          <Stop key={`RadialGradientItem_${index}`} offset={offset} stopColor={color} stopOpacity={opacity} />
        ))}
      </SVGRadialGradient>
    </Defs>
    <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
  </Svg>
)

export const PeachyGradient = (props: Pick<Props, 'style'>) => (
  <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={peachyGradient} {...props} />
)
