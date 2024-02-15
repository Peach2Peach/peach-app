import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import i18n from "../../utils/i18n";
import { getWalletLabel } from "../../utils/offer/getWalletLabel";

type Props = {
  address?: string;
  isPayoutWallet?: boolean;
};

export const useWalletLabel = ({ address, isPayoutWallet = false }: Props) => {
  const [customAddress, customAddressLabel, isPeachWalletActive] =
    useSettingsStore(
      (state) =>
        isPayoutWallet
          ? [
              state.payoutAddress,
              state.payoutAddressLabel,
              state.payoutToPeachWallet,
            ]
          : [
              state.refundAddress,
              state.refundAddressLabel,
              state.refundToPeachWallet,
            ],
      shallow,
    );
  const [fallbackLabel, setFallbackLabel] = useState(i18n("loading"));

  useEffect(() => {
    // this operation can be expensive, hence we delay execution
    setTimeout(() => {
      setFallbackLabel(
        getWalletLabel({
          address,
          customAddress,
          customAddressLabel,
          isPeachWalletActive,
        }),
      );
    });
  }, [address, customAddress, customAddressLabel, isPeachWalletActive]);

  return fallbackLabel;
};
