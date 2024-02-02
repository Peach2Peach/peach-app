import { useEffect } from "react";
import { useSetToast } from "../../../components/toast/Toast";
import { FIFTEEN_SECONDS } from "../../../constants";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import { useNavigation } from "../../../hooks/useNavigation";
import { useRoute } from "../../../hooks/useRoute";
import { parseError } from "../../../utils/result/parseError";
import { useOfferMatches } from "./useOfferMatches";
import { useRefetchOnNotification } from "./useRefetchOnNotification";

const shouldGoToContract = (
  error: APIError,
): error is APIError & { details: { contractId: string } } =>
  !!error.details &&
  typeof error.details === "object" &&
  "contractId" in error.details &&
  typeof error.details.contractId === "string";

export const useSearchSetup = () => {
  const navigation = useNavigation();
  const { offerId } = useRoute<"search">().params;
  const {
    allMatches: matches,
    error,
    refetch,
  } = useOfferMatches(offerId, FIFTEEN_SECONDS);

  const setToast = useSetToast();
  const { offer } = useOfferDetail(offerId);

  useEffect(() => {
    if (error) {
      const errorMessage = parseError(error?.error);
      if (errorMessage === "CANCELED" || errorMessage === "CONTRACT_EXISTS") {
        if (shouldGoToContract(error))
          navigation.replace("contract", {
            contractId: error.details.contractId,
          });
        return;
      }
      if (errorMessage !== "UNAUTHORIZED") {
        setToast({ msgKey: errorMessage, color: "red" });
      }
    }
  }, [error, navigation, setToast]);

  useRefetchOnNotification(refetch);

  return { offer, hasMatches: !!matches.length };
};
