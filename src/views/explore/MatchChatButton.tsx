import { ViewStyle } from "react-native";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

type Props = {
  offerId: string;
  matchingOfferId: string;
  style?: ViewStyle;
};

export function ChatButton({ offerId, matchingOfferId, style }: Props) {
  const navigation = useStackNavigation();

  const onPressCallback = () =>
    navigation.push("matchChat", { offerId, matchingOfferId });

  return (
    <Button style={[tw`bg-primary-main`, style]} onPress={onPressCallback}>
      {i18n("matchchat")}
    </Button>
  );
}
