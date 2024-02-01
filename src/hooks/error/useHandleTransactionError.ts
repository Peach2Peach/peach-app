import { useCallback } from "react";
import { parseError } from "../../utils/result/parseError";
import { InsufficientFundsError } from "../../utils/wallet/types";
import { parseTransactionError } from "../../views/wallet/helpers/parseTransactionError";
import { useShowErrorBanner } from "../useShowErrorBanner";

export const useHandleTransactionError = () => {
  const showErrorBanner = useShowErrorBanner();

  const handleTransactionError = useCallback(
    (e: unknown) => {
      const [err, cause] = e as [Error, string | InsufficientFundsError];
      const error = parseError(err);
      const bodyArgs = parseTransactionError(err, cause);
      showErrorBanner(error, bodyArgs);
    },
    [showErrorBanner],
  );
  return handleTransactionError;
};
