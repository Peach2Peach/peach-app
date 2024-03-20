import { useEffect } from "react";
import { useSetToast } from "../../../components/toast/Toast";
import { useFeeEstimate } from "../../../hooks/query/useFeeEstimate";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { isNumber } from "../../../utils/validation/isNumber";
import { tolgee } from "../../../tolgee";

type Props = {
  enabled: boolean;
};
export const useShowLowFeeWarning = ({ enabled }: Props) => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const { user } = useSelfUser();
  const feeRate = user?.feeRate;
  const { estimatedFees } = useFeeEstimate();

  useEffect(() => {
    if (!enabled || !feeRate) return;
    const rate = isNumber(feeRate) ? feeRate : estimatedFees[feeRate];
    if (rate >= estimatedFees.minimumFee) return;

    setToast({
      msgKey: "contract.warning.lowFee",
      bodyArgs: [String(estimatedFees.minimumFee)],
      color: "yellow",
      action: {
        onPress: () => navigation.navigate("networkFees"),
        label: tolgee.t("contract.warning.lowFee.changeFee", {
          ns: "contract",
        }),
        iconId: "settings",
      },
    });
  }, [
    feeRate,
    navigation,
    enabled,
    estimatedFees.minimumFee,
    estimatedFees,
    setToast,
  ]);
};
