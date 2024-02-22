import { ColorValue, View } from "react-native";
import { NewBubble, NewBubbleProps } from "../../components/bubble/Bubble";
import tw from "../../styles/tailwind";
import { Section } from "./components/Section";
import { useTranslate } from "@tolgee/react";

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
  const { t } = useTranslate();
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
          {t("peachWallet", { ns: "wallet" })}
        </NewBubble>
        <NewBubble
          color={bubbleColor}
          ghost={peachWalletActive}
          disabled={!peachWalletActive}
          iconId={!address ? "plusCircle" : undefined}
          onPress={onExternalWalletPress}
        >
          {addressLabel || t("externalWallet")}
        </NewBubble>
      </View>
    </Section.Container>
  );
}
