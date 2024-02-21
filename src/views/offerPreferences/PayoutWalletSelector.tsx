import tw from "../../styles/tailwind";
import { WalletSelector } from "./WalletSelector";
import { useTranslate } from "@tolgee/react";

type Props = {
  peachWalletSelected: boolean;
  customAddress: string | undefined;
  customAddressLabel: string | undefined;
  onPeachWalletPress: () => void;
  onExternalWalletPress: () => void;
};

export function PayoutWalletSelector({
  peachWalletSelected,
  customAddress,
  customAddressLabel,
  onPeachWalletPress,
  onExternalWalletPress,
}: Props) {
  const { t } = useTranslate("offerPreferences");
  return (
    <WalletSelector
      title={t("offerPreferences.payoutTo")}
      backgroundColor={tw.color("success-mild-1")}
      bubbleColor="green"
      peachWalletActive={peachWalletSelected}
      address={customAddress}
      addressLabel={customAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  );
}
