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
  network: "bitcoin" | "liquid";
};
export const useNetworkFeesSetup = ({ network }: Props) => {
  const { user } = useSelfUser();
  const feeRate = network === "bitcoin" ? user?.feeRate : user?.feeRateLiquid;
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
      { [network === "bitcoin" ? "feeRate" : "feeRateLiquid"]: finalFeeRate },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: userKeys.self() }),
        onError: (err) => setToast({ msgKey: err.message, color: "red" }),
      },
    );
  }, [finalFeeRate, mutate, network, queryClient, setToast]);

  useEffect(() => {
    setSelectedFeeRate(undefined);
    setCustomFeeRate(undefined);
  }, [network, setSelectedFeeRate, setCustomFeeRate]);

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
