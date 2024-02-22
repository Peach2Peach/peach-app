import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { OptionButton } from "../../components/buttons/OptionButton";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";

export const TestView = () => {
  const navigation = useStackNavigation();
  const goToPeachWalletTesting = () =>
    navigation.navigate("testViewPeachWallet");
  const goToLiquidWalletTesting = () =>
    navigation.navigate("testViewLiquidWallet");
  const goToPNTesting = () => navigation.navigate("testViewPNs");

  return (
    <Screen>
      <View style={tw`justify-center gap-4 grow`}>
        <OptionButton onPress={goToPeachWalletTesting}>
          Peach wallet
        </OptionButton>
        <OptionButton onPress={goToLiquidWalletTesting}>
          Liquid wallet
        </OptionButton>
        <OptionButton onPress={goToPNTesting}>Push notifications</OptionButton>
      </View>
    </Screen>
  );
};
