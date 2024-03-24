import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useSetToast } from "../../../components/toast/Toast";
import { useSelfUser, userKeys } from "../../../hooks/query/useSelfUser";
import { useValidatedState } from "../../../hooks/useValidatedState";
import { useUpdateUser } from "../../../utils/peachAPI/useUpdateUser";

const customFeeRules = {
  required: true,
  feeRate: true,
};
type Props = {
  chain: Chain;
};
export const useNetworkFeesSetup = ({ chain }: Props) => {
  const { user } = useSelfUser();
  const feeRate = chain === "bitcoin" ? user?.feeRate : user?.feeRateLiquid;
  const queryClient = useQueryClient();
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
      { [chain === "bitcoin" ? "feeRate" : "feeRateLiquid"]: finalFeeRate },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: userKeys.self() }),
        onError: (err) => setToast({ msgKey: err.message, color: "red" }),
      },
    );
  }, [finalFeeRate, mutate, chain, queryClient, setToast]);

  useEffect(() => {
    setSelectedFeeRate(undefined);
    setCustomFeeRate(undefined);
  }, [chain, setSelectedFeeRate, setCustomFeeRate]);

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
