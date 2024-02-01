import { View } from "react-native";
import { Loading, NewLoading } from "../../components/animation/Loading";
import tw from "../../styles/tailwind";

export const LoadingScreen = () => (
  <View style={tw`items-center justify-center h-full`}>
    <Loading />
  </View>
);

export const NewLoadingScreen = () => (
  <View style={tw`items-center justify-center h-full`}>
    <NewLoading size={"large"} />
  </View>
);
