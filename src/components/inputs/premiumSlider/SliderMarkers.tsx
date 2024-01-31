import { View } from "react-native";
import tw from "../../../styles/tailwind";

type SliderMarkersProp = ComponentProps & {
  positions: number[];
};

export const SliderMarkers = ({ positions }: SliderMarkersProp) => (
  <>
    {positions.map((position) => (
      <View
        key={position}
        style={[
          tw`absolute items-center justify-center w-full top-3 bottom-3`,
          { left: position },
        ]}
      >
        <View style={tw`w-[2px] h-full bg-primary-mild-1`} />
      </View>
    ))}
  </>
);
