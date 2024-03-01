import { ColorValue, View } from "react-native";
import { NewBubble, NewBubbleProps } from "../../components/bubble/Bubble";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Section } from "./components/Section";

type Props = {
  backgroundColor: ColorValue | undefined;
  bubbleColor: NewBubbleProps["color"];
  peachWalletActive: boolean;
  address?: string;
  addressLabel?: string;
  onPeachWalletPress: NewBubbleProps["onPress"];
  onExternalWalletPress: NewBubbleProps["onPress"];
  title: string;
  showExternalWallet?: boolean;
};

export function WalletSelector({
  backgroundColor,
  bubbleColor,
  peachWalletActive,
  address,
  addressLabel,
  onPeachWalletPress,
  onExternalWalletPress,
  title,
  showExternalWallet = true,
}: Props) {
  return (
    <Section.Container style={{ backgroundColor }}>
      <Section.Title>{title}</Section.Title>
      <View style={tw`flex-row items-center gap-10px`}>
        <NewBubble
          color={bubbleColor}
          ghost={!peachWalletActive}
          disabled={peachWalletActive}
          onPress={onPeachWalletPress}
        >
          {i18n("peachWallet")}
        </NewBubble>
        {showExternalWallet && (
          <NewBubble
            color={bubbleColor}
            ghost={peachWalletActive}
            disabled={!peachWalletActive}
            iconId={!address ? "plusCircle" : undefined}
            onPress={onExternalWalletPress}
          >
            {addressLabel || i18n("externalWallet")}
          </NewBubble>
        )}
      </View>
    </Section.Container>
  );
}
