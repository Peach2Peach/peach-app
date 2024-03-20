import { View } from "react-native";
import { IconType } from "../../assets/icons";
import { NewBubble } from "../../components/bubble/Bubble";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { keys } from "../../utils/object/keys";

const WALLETS = {
  wallet: "bitcoin",
  lightningWallet: "lightning",
  liquidWallet: "liquid",
};
const logoMap: Record<keyof typeof WALLETS, IconType> = {
  wallet: "bitcoinLogo",
  liquidWallet: "liquidLogo",
  lightningWallet: "lightningLogo",
};
export const ChainSelect = ({ current }: { current: Chain }) => {
  const navigation = useStackNavigation();
  return (
    <View style={tw`flex-row gap-4 justify-center p-4`}>
      {keys(WALLETS).map((wallet) => {
        const chain = WALLETS[wallet];
        const logo = logoMap[wallet];
        const isSelected = current === chain;
        const goToWallet = () =>
          navigation.navigate("homeScreen", { screen: wallet });
        return (
          <NewBubble
            key={wallet}
            onPress={goToWallet}
            color={isSelected ? "orange" : "black"}
            ghost={true}
            iconId={logo}
            disabled={isSelected}
          >
            {i18n(`wallet.wallet.${chain}`)}
          </NewBubble>
        );
      })}
    </View>
  );
};
