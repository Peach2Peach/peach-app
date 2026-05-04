import { Image, ImageSourcePropType, View } from "react-native";
import { Loading } from "../../components/Loading";
import tw from "../../styles/tailwind";

type Props = {
  source: ImageSourcePropType;
  width: number;
  height: number;
  isLoading: boolean;
};

export const ActionImageWithLoader = ({
  source,
  width,
  height,
  isLoading,
}: Props) => (
  <View style={{ width, height }}>
    <Image
      source={source}
      style={[{ width, height }, isLoading && tw`opacity-30`]}
      resizeMode="contain"
    />
    {isLoading && (
      <View style={tw`absolute inset-0 items-center justify-center`}>
        <Loading size="large" />
      </View>
    )}
  </View>
);
