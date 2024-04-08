import {
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewProps,
} from "react-native";
import tw from "../styles/tailwind";

export const Loading = ({
  style,
  color,
  size,
}: ViewProps & ActivityIndicatorProps) => (
  <ActivityIndicator
    style={style}
    size={size ?? "small"}
    color={color ?? tw.color("primary-main")}
  />
);
