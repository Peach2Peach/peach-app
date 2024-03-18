import { View } from "react-native";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";

export const ChainSelect = ({ current }: { current: Chain }) => {
  const navigation = useStackNavigation();
  const goToBitcoinWallet = () => {
    navigation.navigate("homeScreen", { screen: "wallet" });
  };
  const goToLiquidWallet = () => {
    navigation.navigate("homeScreen", { screen: "liquidWallet" });
  };
  const goToLightningWallet = () => {
    navigation.navigate("homeScreen", { screen: "lightningWallet" });
  };
  return (
    <View style={tw`flex-row gap-4 justify-center p-4`}>
      <PeachText
        onPress={goToBitcoinWallet}
        disabled={current === "bitcoin"}
        style={current === "bitcoin" ? tw`font-bold` : undefined}
      >
        on-chain
      </PeachText>
      <PeachText
        onPress={goToLiquidWallet}
        disabled={current === "liquid"}
        style={current === "liquid" ? tw`font-bold` : undefined}
      >
        liquid
      </PeachText>
      <PeachText
        onPress={goToLightningWallet}
        disabled={current === "lightning"}
        style={current === "lightning" ? tw`font-bold` : undefined}
      >
        lightning
      </PeachText>
    </View>
  );
};
