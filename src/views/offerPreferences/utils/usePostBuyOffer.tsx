import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { OfferPaymentData } from "../../../../peach-api/src/@types/offer";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { offerKeys } from "../../../hooks/query/offerKeys";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { InfoPopup } from "../../../popups/InfoPopup";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../utils/account/getMessageToSignForAddress";
import i18n from "../../../utils/i18n";
import { interpolate } from "../../../utils/math/interpolate";
import { peachAPI } from "../../../utils/peachAPI";
import { isPaymentMethod } from "../../../utils/validation/isPaymentMethod";
import { isValidBitcoinSignature } from "../../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { peachWallet } from "../../../utils/wallet/setWallet";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../../settings/profile/profileOverview/Rating";

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === "FORBIDDEN" &&
  Array.isArray(errorDetails) &&
  errorDetails.every(isPaymentMethod);

export function usePostBuyOffer({
  amount,
  meansOfPayment,
  maxPremium,
  minReputation,
  instantTradeCriteria,
}: Pick<
  BuyOfferDraft,
  | "amount"
  | "meansOfPayment"
  | "maxPremium"
  | "minReputation"
  | "instantTradeCriteria"
>) {
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const showErrorBanner = useShowErrorBanner();
  const setPopup = useSetPopup();
  const showHelp = () =>
    setPopup(
      <InfoPopup content={i18n("FORBIDDEN_PAYMENT_METHOD.paypal.text")} />,
    );
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const [payoutAddress, payoutToPeachWallet, payoutAddressSignature] =
    useSettingsStore(
      (state) => [
        state.payoutAddress,
        state.payoutToPeachWallet,
        state.payoutAddressSignature,
      ],
      shallow,
    );

  const getSignedAddress = async (signWithPeachWallet: boolean) => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (signWithPeachWallet) {
      const { address, index } = await peachWallet.getAddress();
      const message = getMessageToSignForAddress(publicKey, address);
      return {
        address,
        message,
        signature: peachWallet.signMessage(message, index),
      };
    }
    if (!payoutAddress) throw new Error("MISSING_RELEASE_ADDRESS");
    const message = getMessageToSignForAddress(publicKey, payoutAddress);
    return {
      address: payoutAddress,
      message,
      signature: payoutAddressSignature,
    };
  };

  return useMutation({
    mutationFn: async (paymentData: OfferPaymentData) => {
      const { message, signature, address } =
        await getSignedAddress(payoutToPeachWallet);

      if (
        !signature ||
        !isValidBitcoinSignature({
          message,
          address,
          signature,
          network: getNetwork(),
        })
      ) {
        throw new Error("INVALID_SIGNATURE");
      }
      const finalCriteria = instantTradeCriteria
        ? {
            ...instantTradeCriteria,
            minReputation: interpolate(
              instantTradeCriteria.minReputation,
              CLIENT_RATING_RANGE,
              SERVER_RATING_RANGE,
            ),
          }
        : undefined;
      const finalizedOfferDraft = {
        type: "bid" as const,
        amount,
        meansOfPayment,
        paymentData,
        maxPremium,
        minReputation,
        releaseAddress: address,
        message,
        messageSignature: signature,
        instantTradeCriteria: finalCriteria,
      };

      const { result, error: err } =
        await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft);

      if (result) return result.id;
      throw new Error(err?.error || "POST_OFFER_ERROR", {
        cause: err?.details,
      });
    },
    onError: ({ message, cause }: Error) => {
      if (isForbiddenPaymentMethodError(message, cause)) {
        const paymentMethod = cause.pop();
        if (paymentMethod === "paypal") showHelp();
      } else {
        showErrorBanner(message);
      }
    },
    onSuccess: (offerId) => {
      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "yourTrades" } },
          { name: "explore", params: { offerId } },
        ],
      });
    },
    onSettled: async (offerId) => {
      if (offerId) {
        await queryClient.invalidateQueries({
          queryKey: offerKeys.detail(offerId),
        });
      }
      return queryClient.invalidateQueries({ queryKey: offerKeys.summaries() });
    },
  });
}
