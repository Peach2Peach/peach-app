import { useCallback, useState } from "react";
import { useSetToast } from "../../../components/toast/Toast";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useUpdateUser } from "../../../utils/peachAPI/useUpdateUser";

const customFeeRules = {
  required: true,
  feeRate: true,
};
export const useNetworkFeesSetup = () => {
  const { user } = useSelfUser();
  const feeRate = user?.feeRate;

  const defaultFeeRate = feeRate
    ? typeof feeRate === "number"
      ? "custom"
      : feeRate
    : "halfHourFee";
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | "custom">();
  const displayRate = selectedFeeRate ?? defaultFeeRate;

  const defaultCustomFeeRate =
    typeof feeRate === "number" ? feeRate.toString() : "";
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] =
    useValidatedState<string | undefined>(undefined, customFeeRules);
  const displayCustomRate = customFeeRate ?? defaultCustomFeeRate;

  const finalFeeRate =
    displayRate === "custom" ? Number(displayCustomRate) : displayRate;

  const setToast = useSetToast();
  const { mutate } = useUpdateUser();

  const onChangeCustomFeeRate = (value: string) =>
    setCustomFeeRate(
      !value || isNaN(Number(value)) || value === "0" ? "" : value,
    );

  const submit = useCallback(() => {
    mutate(
      { feeRate: finalFeeRate },
      {
        onError: (err) => setToast({ msgKey: err.message, color: "red" }),
      },
    );
  }, [finalFeeRate, mutate, setToast]);

  return {
    selectedFeeRate: displayRate,
    setSelectedFeeRate,
    customFeeRate: displayCustomRate,
    setCustomFeeRate: onChangeCustomFeeRate,
    submit,
    isValid: selectedFeeRate !== "custom" || isValidCustomFeeRate,
    feeRateSet:
      displayRate === "custom"
        ? feeRate === Number(displayCustomRate)
        : feeRate === displayRate,
  };
};
