import Lottie from "lottie-react-native";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  ViewProps,
} from "react-native";
import tw from "../../styles/tailwind";
import loading from "../animation/lotties/loading.json";

type Props = ComponentProps & {
  color?: string;
};

export const Loading = ({ style, color }: Props) => (
  <Lottie
    style={[tw`w-20 h-20`, style]}
    source={loading}
    autoPlay
    colorFilters={[
      {
        keypath: "main",
        color: color ?? (tw.color("primary-main") || "#F56522"),
      },
    ]}
  />
);

export const NewLoading = ({
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
