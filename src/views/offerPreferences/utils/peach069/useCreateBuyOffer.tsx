import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useSetPopup } from "../../../../components/popup/GlobalPopup";
import { offerKeys } from "../../../../hooks/query/useOfferDetail";
import { useShowErrorBanner } from "../../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../../hooks/useStackNavigation";
import { InfoPopup } from "../../../../popups/InfoPopup";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../../utils/account/getMessageToSignForAddress";
import i18n from "../../../../utils/i18n";
import { peachAPI } from "../../../../utils/peachAPI";
import { isPaymentMethod } from "../../../../utils/validation/isPaymentMethod";
import { isValidBitcoinSignature } from "../../../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../../../utils/wallet/getNetwork";
import { peachWallet } from "../../../../utils/wallet/setWallet";

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === "FORBIDDEN" &&
  Array.isArray(errorDetails) &&
  errorDetails.every(isPaymentMethod);

export function useCreateBuyOffer({
  amount,
  meansOfPayment,
  paymentData,
  premium,
  minReputation,
  instantTradeCriteria,
}: Pick<
  BuyOffer69Draft,
  | "amount"
  | "meansOfPayment"
  | "paymentData"
  | "premium"
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
    mutationFn: async () => {
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
      const finalizedOfferDraft = {
        amount,
        meansOfPayment,
        paymentData,
        premium,
        minReputation: minReputation ? minReputation : undefined, // TODO fix this
        releaseAddress: address,
        releaseAddressMessageSignature: signature,
        instantTradeCriteria,
      };

      const { result, error: err } =
        await peachAPI.private.peach069.createBuyOffer(finalizedOfferDraft);

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
          { name: "browseTradeRequestsToMyBuyOffer", params: { offerId } },
        ],
      });
    },
    onSettled: async (offerId) => {
      if (offerId) {
        await queryClient.invalidateQueries({
          queryKey: offerKeys.detail(String(offerId)),
        });
      }
      return queryClient.invalidateQueries({ queryKey: offerKeys.summaries() });
    },
  });
}
