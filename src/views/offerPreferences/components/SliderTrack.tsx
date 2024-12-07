import { View } from "react-native";
import tw from "../../../styles/tailwind";

type Props = {
  slider?: JSX.Element;
  trackWidth: number;
  type: "sell" | "buy";
};

export const horizontalTrackPadding = 22;

export function SliderTrack({ slider, trackWidth, type }: Props) {
  const color =
    type === "sell" ? tw.color("primary-mild-2") : tw.color("success-mild-2");
  return (
    <View
      style={[
        tw`flex-row items-center justify-between border py-14px rounded-2xl`,
        type === "buy" && tw`bg-success-background-dark`,
        {
          width: trackWidth,
          paddingHorizontal: horizontalTrackPadding,
          borderColor: color,
        },
      ]}
    >
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />

      {slider}
    </View>
  );
}

function TrackMarker({ color }: { color: string | undefined }) {
  return (
    <View style={[tw`h-1 w-2px rounded-px`, { backgroundColor: color }]} />
  );
}
