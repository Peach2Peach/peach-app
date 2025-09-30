import { StyleProp, View, ViewStyle } from "react-native";
import Svg, {
  Defs,
  Rect,
  RadialGradient as SVGRadialGradient,
  Stop,
} from "react-native-svg";

type Props = {
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  centerColor: string;
  middleColor: string;
  edgeColor: string;
};

export const RadialGradientBorder = ({
  borderWidth = 1,
  style,
  children,
  centerColor,
  middleColor,
  edgeColor,
}: Props) => (
  <View style={[style, { overflow: "hidden" }]}>
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <SVGRadialGradient
            id="customGrad"
            cx="50%"
            cy="50%"
            rx="60%"
            ry="60%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={centerColor} stopOpacity="1" />
            <Stop offset="50%" stopColor={middleColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={edgeColor} stopOpacity="1" />
          </SVGRadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#customGrad)" />
      </Svg>
    </View>

    <View style={{ margin: borderWidth, backgroundColor: "transparent" }}>
      {children}
    </View>
  </View>
);
