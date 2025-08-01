import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMatchesResponseBody } from "../../../../peach-api/src/@types/api/offerAPI";
import { Match } from "../../../../peach-api/src/@types/match";
import { PaymentMethodInfo } from "../../../../peach-api/src/@types/payment";
import { contractKeys } from "../../../hooks/query/useContractDetail";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { AppPopup } from "../../../popups/AppPopup";
import { getHashedPaymentData } from "../../../store/offerPreferenes/helpers";
import { getRandom } from "../../../utils/crypto/getRandom";
import { error } from "../../../utils/log/error";
import { info } from "../../../utils/log/info";
import { parseError } from "../../../utils/parseError";
import { cleanPaymentData } from "../../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { usePaymentMethods } from "../../../views/addPaymentMethod/usePaymentMethodInfo";
import { matchesKeys } from "../../../views/search/hooks/useOfferMatches";
import { useSetPopup } from "../../popup/GlobalPopup";
import { getMatchPrice } from "../utils/getMatchPrice";
import { useHandleError } from "../utils/useHandleError";
import { useHandleMissingPaymentData } from "../utils/useHandleMissingPaymentData";

export const useMatchOffer = (offer: BuyOffer, match: Match) => {
  const matchId = match.offerId;
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const handleError = useHandleError();
  const setPopup = useSetPopup();
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const handleMissingPaymentData = useHandleMissingPaymentData();
  const { data: paymentMethods } = usePaymentMethods();

  return useMutation({
    onMutate: async ({ selectedCurrency, paymentData }) => {
      const selectedPaymentMethod = paymentData?.type;
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: matchesKeys.matchesForOffer(offer.id),
        }),
        queryClient.cancelQueries({
          queryKey: matchesKeys.matchDetail(offer.id, matchId),
        }),
      ]);
      const previousData = queryClient.getQueryData<GetMatchesResponseBody>(
        matchesKeys.matchesForOffer(offer.id),
      );
      queryClient.setQueryData<Match>(
        matchesKeys.matchDetail(offer.id, matchId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            matched: true,
            selectedCurrency,
            selectedPaymentMethod,
          };
        },
      );

      return { previousData };
    },
    mutationFn: async ({
      selectedCurrency,
      paymentData,
      maxMiningFeeRate,
    }: {
      selectedCurrency: Currency;
      paymentData: PaymentData | undefined;
      maxMiningFeeRate?: number;
    }) => {
      if (!selectedCurrency || !paymentData) throw new Error("MISSING_VALUES");
      const paymentMethodInfo = paymentMethods?.find(
        ({ id }) => id === paymentData.type,
      );

      const { result: matchOfferData, error: dataError } =
        await generateMatchOfferData({
          offer,
          match,
          currency: selectedCurrency,
          paymentData,
          pgpPublicKeys,
          paymentMethodInfo,
        });
      if (!matchOfferData) throw new Error(dataError || "UNKNOWN_ERROR");
      const { result, error: err } = await peachAPI.private.offer.matchOffer({
        ...matchOfferData,
        maxMiningFeeRate,
      });

      if (result) {
        return result;
      }
      if (err) handleError(err);
      throw new Error("OFFER_TAKEN");
    },
    onError: (err, { selectedCurrency, paymentData }, context) => {
      const selectedPaymentMethod = paymentData?.type;
      const errorMsg = parseError(err);

      if (errorMsg === "MISSING_PAYMENTDATA" && selectedPaymentMethod) {
        handleMissingPaymentData(
          offer,
          selectedCurrency,
          selectedPaymentMethod,
        );
      } else if (errorMsg === "OFFER_TAKEN") {
        setPopup(<AppPopup id="offerTaken" />);
      } else {
        if (errorMsg === "MISSING_VALUES")
          error(
            "Match data missing values.",
            `selectedCurrency: ${selectedCurrency}`,
            `selectedPaymentMethod: ${selectedPaymentMethod}`,
          );
        handleError({ error: errorMsg });
      }
      queryClient.setQueryData(
        matchesKeys.matchesForOffer(offer.id),
        context?.previousData,
      );
    },
    onSuccess: (result: MatchResponse) => {
      if ("contractId" in result && result.contractId) {
        info(
          "Search.tsx - _match",
          `navigate to contract ${result.contractId}`,
        );
        navigation.replace("contract", { contractId: result.contractId });
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offer.id) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchesForOffer(offer.id),
        }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchDetail(offer.id, matchId),
        }),
      ]),
  });
};

type Params = {
  offer: BuyOffer;
  match: Match;
  currency: Currency;
  paymentData: PaymentData;
  pgpPublicKeys: string[];
  paymentMethodInfo?: PaymentMethodInfo;
};

const SYMMETRIC_KEY_BYTES = 32;
async function generateMatchOfferData({
  offer,
  match,
  currency,
  paymentData,
  pgpPublicKeys,
  paymentMethodInfo,
}: Params) {
  const paymentMethod = paymentData.type;

  const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString("hex");
  const { encrypted, signature } = await signAndEncrypt(
    symmetricKey,
    [
      ...pgpPublicKeys,
      ...match.user.pgpPublicKeys.map((pgp) => pgp.publicKey),
    ].join("\n"),
  );

  const encryptedPaymentData = await encryptPaymentData(
    cleanPaymentData(paymentData),
    symmetricKey,
  );
  if (!encryptedPaymentData) return { error: "PAYMENTDATA_ENCRYPTION_FAILED" };
  const hashedPaymentData = getHashedPaymentData([paymentData]);
  return {
    result: {
      offerId: offer.id,
      matchingOfferId: match.offerId,
      price: getMatchPrice(match, currency, paymentMethodInfo),
      premium: match.premium,
      currency,
      paymentMethod,
      paymentData: hashedPaymentData,
      instantTrade: match.instantTrade,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    },
  };
}
