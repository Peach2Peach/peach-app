import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export default function ChatButton({
  offerId,
  requestingUserId,
}: {
  offerId: string;
  requestingUserId: string;
}) {
  const navigation = useStackNavigation();

  const onPressCallback = () =>
    navigation.push("tradeRequestChat", { offerId, requestingUserId });

  return (
    <Button style={tw`flex-1 py-3 bg-success-main`} onPress={onPressCallback}>
      {i18n("CHAT BUTTON")}
    </Button>
  );
}
