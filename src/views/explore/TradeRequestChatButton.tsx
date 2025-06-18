import { ViewStyle } from "react-native";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useSymmetricKeyEncrypted } from "../tradeRequestChat/useSymmetricKeyEncrypted";

type Props = {
  chatRoomId: string;
  offerType: "buyOffer" | "sellOffer";
  style?: ViewStyle;
};

export function TradeRequestChatButton({
  chatRoomId,
  offerType,
  style,
}: Props) {
  const navigation = useStackNavigation();
  const { isSuccess } = useSymmetricKeyEncrypted(offerType, chatRoomId);
  if (!isSuccess) return null;

  const onPressCallback = () =>
    navigation.navigate("tradeRequestChat", { chatRoomId });

  return (
    <Button style={[tw`bg-primary-main`, style]} onPress={onPressCallback}>
      {i18n("chat")}
    </Button>
  );
}
