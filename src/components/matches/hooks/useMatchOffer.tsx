import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { GetMatchesResponseBody } from "../../../../peach-api/src/@types/api/offerAPI";
import { Match } from "../../../../peach-api/src/@types/match";
import { BuyOffer } from "../../../../peach-api/src/@types/offer";
import { GiftCardCountry } from "../../../../peach-api/src/@types/payment";
import { offerKeys } from "../../../hooks/query/offerKeys";
import { contractKeys } from "../../../hooks/query/useContractDetail";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { AppPopup } from "../../../popups/AppPopup";
import { getHashedPaymentData } from "../../../store/offerPreferenes/helpers";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore/usePaymentDataStore";
import { getRandom } from "../../../utils/crypto/getRandom";
import i18n from "../../../utils/i18n";
import { error } from "../../../utils/log/error";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { parseError } from "../../../utils/parseError";
import { cleanPaymentData } from "../../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { matchesKeys } from "../../../views/search/hooks/useOfferMatches";
import { useSetPopup } from "../../popup/GlobalPopup";
import { useSetToast } from "../../toast/Toast";
import { getMatchPrice } from "../utils/getMatchPrice";

export const useMatchOffer = (offer: BuyOffer, match: Match) => {
  const matchId = match.offerId;
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const setToast = useSetToast();

  const setPopup = useSetPopup();
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const handleMissingPaymentData = useHandleMissingPaymentData();

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

      const { result: matchOfferData, error: dataError } =
        await generateMatchOfferData({
          offer,
          match,
          currency: selectedCurrency,
          paymentData,
          pgpPublicKeys,
        });
      if (!matchOfferData) throw new Error(dataError || "UNKNOWN_ERROR");
      const { result, error: err } = await peachAPI.private.offer.matchOffer({
        ...matchOfferData,
        maxMiningFeeRate,
      });

      if (result) {
        return result;
      }
      if (err) {
        setToast({
          msgKey: i18n("error.general"),
          color: "red",
        });
      }
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
        setToast({
          msgKey: i18n("error.general"),
          color: "red",
        });
      }
      queryClient.setQueryData(
        matchesKeys.matchesForOffer(offer.id),
        context?.previousData,
      );
    },
    onSuccess: (result) => {
      if ("contractId" in result && result.contractId) {
        navigation.reset({
          index: 1,
          routes: [
            { name: "homeScreen", params: { screen: "yourTrades" } },
            { name: "contract", params: { contractId: result.contractId } },
          ],
        });
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
};

const SYMMETRIC_KEY_BYTES = 32;
async function generateMatchOfferData({
  offer,
  match,
  currency,
  paymentData,
  pgpPublicKeys,
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
      price: getMatchPrice(
        {
          matched: match.matched,
          matchedPrice: match.matchedPrice,
          prices: match.prices,
        },
        paymentMethod,
        currency,
      ),
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

function useHandleMissingPaymentData() {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const paymentData = usePaymentDataStore((state) =>
    Object.values(state.paymentData),
  );

  const openAddPaymentMethodDialog = useCallback(
    (
      offer: BuyOffer | SellOffer,
      currency: Currency,
      paymentMethod: PaymentMethod,
    ) => {
      const existingPaymentMethodsOfType =
        paymentData.filter(({ type }) => type === paymentMethod).length + 1;
      const label = `${i18n(`paymentMethod.${paymentMethod}`)} #${existingPaymentMethodsOfType}`;

      navigation.push("paymentMethodForm", {
        paymentData: {
          type: paymentMethod,
          label,
          currencies: [currency],
          country: /giftCard/u.test(paymentMethod)
            ? (paymentMethod.split(".").pop() as GiftCardCountry)
            : undefined,
        },
        origin: isBuyOffer(offer) ? "matchDetails" : "search",
      });
    },
    [navigation, paymentData],
  );

  const handleMissingPaymentData = useCallback(
    (
      offer: BuyOffer | SellOffer,
      currency: Currency,
      paymentMethod: PaymentMethod,
    ) => {
      error("Payment data could not be found for offer", offer.id);

      setToast({
        msgKey: "PAYMENT_DATA_MISSING",
        color: "red",
        action: {
          onPress: () =>
            openAddPaymentMethodDialog(offer, currency, paymentMethod),
          label: i18n("PAYMENT_DATA_MISSING.action"),
          iconId: "edit3",
        },
        keepAlive: true,
      });
    },
    [openAddPaymentMethodDialog, setToast],
  );

  return handleMissingPaymentData;
}
