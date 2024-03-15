import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { WalletSelector } from "./WalletSelector";

type Props = {
  peachWalletSelected: boolean;
  customAddress: string | undefined;
  customAddressLabel: string | undefined;
  onPeachWalletPress: () => void;
  onExternalWalletPress: () => void;
  showExternalWallet?: boolean;
};

export function PayoutWalletSelector({
  peachWalletSelected,
  customAddress,
  customAddressLabel,
  onPeachWalletPress,
  onExternalWalletPress,
  showExternalWallet = true,
}: Props) {
  return (
    <WalletSelector
      title={i18n("offerPreferences.payoutTo")}
      backgroundColor={tw.color("success-mild-1")}
      bubbleColor="green"
      peachWalletActive={peachWalletSelected}
      address={customAddress}
      addressLabel={customAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
      showExternalWallet={showExternalWallet}
    />
  );
}
