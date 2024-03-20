import { Button } from "../../components/buttons/Button";
import { useKeyboard } from "../../hooks/useKeyboard";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

type Props = {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
};

export function ShowOffersButton({ onPress, disabled, loading }: Props) {
  const { t } = useTranslate("offerPreferences");
  const keyboardIsOpen = useKeyboard();
  if (keyboardIsOpen) return null;
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
    >
      {t("offerPreferences.showOffers")}
    </Button>
  );
}
