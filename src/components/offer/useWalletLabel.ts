import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { getWalletLabel } from "../../utils/offer/getWalletLabel";
import { useTranslate } from "@tolgee/react";

type Props = {
  address?: string;
  isPayoutWallet?: boolean;
};

export const useWalletLabel = ({ address, isPayoutWallet = false }: Props) => {
  const { t } = useTranslate();
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
  const [fallbackLabel, setFallbackLabel] = useState(t("loading"));

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
