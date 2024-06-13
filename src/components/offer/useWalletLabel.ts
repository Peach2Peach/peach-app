import { useTranslate } from "@tolgee/react";
import { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";

type Props = {
  address?: string;
  isPayoutWallet?: boolean;
};

export const useWalletLabel = ({ address, isPayoutWallet = false }: Props) => {
  const { t: i18n } = useTranslate("offer");
  const [customAddress, customAddressLabel] = useSettingsStore(
    (state) =>
      isPayoutWallet
        ? [state.payoutAddress, state.payoutAddressLabel]
        : [state.refundAddress, state.refundAddressLabel],
    shallow,
  );
  const belongsToPeachWallet = useIsMyAddress(address || "");

  const walletLabel = useMemo(() => {
    if (belongsToPeachWallet) return i18n("peachWallet", { ns: "wallet" });
    if (customAddress === address)
      return customAddressLabel || i18n("offer.summary.customPayoutAddress");
    return i18n("offer.summary.customPayoutAddress");
  }, [belongsToPeachWallet, i18n, customAddress, address, customAddressLabel]);

  return walletLabel;
};
