import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../../utils/i18n";

type Props = {
  address?: string;
  isPayoutWallet?: boolean;
};

export const useWalletLabel = ({ address, isPayoutWallet = false }: Props) => {
  const [customAddress, customAddressLabel] = useSettingsStore(
    useShallow((state) =>
      isPayoutWallet
        ? [state.payoutAddress, state.payoutAddressLabel]
        : [state.refundAddress, state.refundAddressLabel],
    ),
  );
  const belongsToPeachWallet = useIsMyAddress(address || "");

  const walletLabel = useMemo(() => {
    if (belongsToPeachWallet) return i18n("peachWallet");
    if (customAddress === address)
      return customAddressLabel || i18n("offer.summary.customPayoutAddress");
    return i18n("offer.summary.customPayoutAddress");
  }, [belongsToPeachWallet, address, customAddress, customAddressLabel]);

  return walletLabel;
};
