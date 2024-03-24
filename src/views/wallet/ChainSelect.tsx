import { View } from "react-native";
import { NewBubble } from "../../components/bubble/Bubble";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

const CHAINS: Chain[] = ["bitcoin", "lightning", "liquid"];
export const ChainSelect = ({
  current,
  onSelect,
  filter,
  style,
}: ComponentProps & {
  current: Chain;
  filter?: Chain[];
  onSelect: (chain: Chain) => void;
}) => (
  <View style={[tw`flex-row gap-4 justify-center`, style]}>
    {CHAINS.filter((chain) => !filter?.includes(chain)).map((chain) => {
      const isSelected = current === chain;
      const goToWallet = () => onSelect(chain);
      return (
        <NewBubble
          key={chain}
          onPress={goToWallet}
          color={isSelected ? "orange" : "black"}
          ghost={true}
          iconId={`${chain}Logo`}
          disabled={isSelected}
        >
          {i18n(`wallet.wallet.${chain}`)}
        </NewBubble>
      );
    })}
  </View>
);
