import { ColorValue, View } from "react-native";
import { NewBubble, NewBubbleProps } from "../../components/bubble/Bubble";
import { useThemeStore } from "../../store/theme";
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
}: Props) {
  const { isDarkMode } = useThemeStore();

  return (
    <Section.Container
      style={{
        backgroundColor: isDarkMode ? tw.color("card") : backgroundColor,
      }}
    >
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
        <NewBubble
          color={bubbleColor}
          ghost={peachWalletActive}
          disabled={!peachWalletActive}
          iconId={!address ? "plusCircle" : undefined}
          onPress={onExternalWalletPress}
        >
          {addressLabel || i18n("externalWallet")}
        </NewBubble>
      </View>
    </Section.Container>
  );
}
