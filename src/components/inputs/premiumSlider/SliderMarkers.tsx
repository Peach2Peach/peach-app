import { View } from "react-native";
import tw from "../../../styles/tailwind";

type SliderMarkersProp = ComponentProps & {
  positions: number[];
  green?: boolean;
};

export const SliderMarkers = ({
  positions,
  green = false,
}: SliderMarkersProp) => {
  return (
    <>
      {positions.map((position) => (
        <View
          key={position}
          style={[
            tw`absolute items-center justify-center w-full top-3 bottom-3`,
            { left: position },
          ]}
        >
          <View
            style={tw`w-[2px] h-full ${green ? "bg-success-mild-1-color" : "bg-primary-mild-1"}`}
          />
        </View>
      ))}
    </>
  );
};
