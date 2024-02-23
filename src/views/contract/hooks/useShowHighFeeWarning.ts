import { useEffect } from "react";
import { useSetToast } from "../../../components/toast/Toast";
import { CENT } from "../../../constants";
import { useFeeRate } from "../../../hooks/useFeeRate";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useTranslate } from "@tolgee/react";

const ESCROW_TX_SIZE = 173;
const WARNING_THRESHOLD = 0.1;

type Props = {
  enabled: boolean;
  amount?: number;
};
export const useShowHighFeeWarning = ({ enabled, amount }: Props) => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const feeRate = useFeeRate();
  const { t } = useTranslate("contract");

  useEffect(() => {
    if (!enabled || !amount) return;

    const expectedFees = ESCROW_TX_SIZE * feeRate;
    const feesInPercent = expectedFees / amount;

    if (feesInPercent < WARNING_THRESHOLD) return;

    setToast({
      msgKey: "contract.warning.highFee",
      bodyArgs: [String(feeRate), (feesInPercent * CENT).toFixed(1)],
      color: "yellow",
      action: {
        onPress: () => navigation.navigate("networkFees"),
        label: t("contract.warning.highFee.changeFee"),
        iconId: "settings",
      },
    });
  }, [setToast, amount, feeRate, navigation, enabled, t]);
};
