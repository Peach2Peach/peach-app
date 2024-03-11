import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useSetOverlay } from "../../../Overlay";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { InfoPopup } from "../../../popups/InfoPopup";
import { useConfigStore } from "../../../store/configStore/configStore";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../utils/account/getMessageToSignForAddress";
import i18n from "../../../utils/i18n";
import { info } from "../../../utils/log/info";
import { peachAPI } from "../../../utils/peachAPI";
import { isPaymentMethod } from "../../../utils/validation/isPaymentMethod";
import { isValidBitcoinSignature } from "../../../utils/validation/isValidBitcoinSignature";
import { isValidLiquidSignature } from "../../../utils/validation/isValidLiquidSignature";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import {
  peachLiquidWallet,
  peachWallet,
} from "../../../utils/wallet/setWallet";
import { GroupHugAnnouncement } from "../../overlays/GroupHugAnnouncement";

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === "FORBIDDEN" &&
  Array.isArray(errorDetails) &&
  errorDetails.every(isPaymentMethod);

export function usePostBuyOffer({
  amount,
  escrowType,
  meansOfPayment,
  paymentData,
  maxPremium,
  minReputation,
}: Pick<
  BuyOfferDraft,
  | "amount"
  | "escrowType"
  | "meansOfPayment"
  | "paymentData"
  | "maxPremium"
  | "minReputation"
>) {
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const showErrorBanner = useShowErrorBanner();
  const hasSeenGroupHugAnnouncement = useConfigStore(
    (state) => state.hasSeenGroupHugAnnouncement,
  );
  const setPopup = useSetPopup();
  const showHelp = () =>
    setPopup(
      <InfoPopup content={i18n("FORBIDDEN_PAYMENT_METHOD.paypal.text")} />,
    );
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const setOverlay = useSetOverlay();
  const [payoutAddress, payoutToPeachWallet, payoutAddressSignature] =
    useSettingsStore(
      (state) => [
        state.payoutAddress,
        state.payoutToPeachWallet,
        state.payoutAddressSignature,
      ],
      shallow,
    );

  return useMutation({
    mutationFn: async () => {
      const wallet = escrowType === "bitcoin" ? peachWallet : peachLiquidWallet;
      if (!wallet) throw new Error("Peach wallet not defined");

      const { address, index } = payoutToPeachWallet
        ? await wallet.getAddress()
        : { address: payoutAddress, index: undefined };

      if (!address) throw new Error("MISSING_RELEASE_ADDRESS");

      const message = getMessageToSignForAddress(publicKey, address);
      const signature = payoutToPeachWallet
        ? wallet.signMessage(message, address, index)
        : payoutAddressSignature;

      if (!signature) throw new Error("MISSING_SIGNATURE");

      const isValidSignature =
        escrowType === "bitcoin"
          ? isValidBitcoinSignature({
              message,
              address,
              signature,
              network: getNetwork(),
            })
          : isValidLiquidSignature({ message, address, signature });
      if (!isValidSignature) throw new Error("INVALID_SIGNATURE");
      info(
        "Generated a valid signature for address ",
        address,
        " of user ",
        publicKey,
        " with message ",
        message,
        ":\n",
        signature,
      );
      const finalizedOfferDraft = {
        type: "bid" as const,
        escrowType,
        amount,
        meansOfPayment,
        paymentData,
        maxPremium,
        minReputation,
        releaseAddress: address,
        message,
        messageSignature: signature,
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
      if (!hasSeenGroupHugAnnouncement)
        setOverlay(<GroupHugAnnouncement offerId={offerId} />);
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
