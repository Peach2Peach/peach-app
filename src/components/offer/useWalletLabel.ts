import { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../../utils/i18n";

type Props = {
  address?: string;
  isPayoutWallet?: boolean;
};

export const useWalletLabel = ({ address, isPayoutWallet = false }: Props) => {
  const [customAddress, customAddressLabel] = useSettingsStore(
    (state) =>
      isPayoutWallet
        ? [state.payoutAddress, state.payoutAddressLabel]
        : [state.refundAddress, state.refundAddressLabel],
    shallow,
  );
  const isAddressMine = useIsMyAddress(address ?? "");

  const belongsToPeachWallet = !address || isAddressMine;

  const walletLabel = useMemo(() => {
    if (belongsToPeachWallet) return i18n("peachWallet");
    if (customAddress === address)
      return customAddressLabel || i18n("offer.summary.customPayoutAddress");
    return i18n("offer.summary.customPayoutAddress");
  }, [belongsToPeachWallet, address, customAddress, customAddressLabel]);

  return walletLabel;
};
