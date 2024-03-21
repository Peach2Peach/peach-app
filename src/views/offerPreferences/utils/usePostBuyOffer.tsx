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
import { isLiquidAddress } from "../../../utils/validation/rules";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
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
  meansOfPayment,
  paymentData,
  maxPremium,
  minReputation,
}: Pick<
  BuyOfferDraft,
  "amount" | "meansOfPayment" | "paymentData" | "maxPremium" | "minReputation"
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
      const { address, message, signature } =
        payoutToPeachWallet && payoutAddress && payoutAddressSignature
          ? {
              address: payoutAddress,
              message: getMessageToSignForAddress(publicKey, payoutAddress),
              signature: payoutAddressSignature,
            }
          : await getWalletAddress(peachWallet);
      const {
        address: releaseAddressLiquid,
        message: messageLiquid,
        signature: messageSignatureLiquid,
      } = await getWalletAddress(peachLiquidWallet);

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
        releaseAddressLiquid,
        messageLiquid,
        messageSignatureLiquid,
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

async function getWalletAddress(
  wallet?: PeachWallet | PeachLiquidJSWallet | null,
) {
  if (!wallet) throw new Error("Peach wallet not defined");
  const publicKey = useAccountStore.getState().account.publicKey;

  const { address, index } = await wallet.getAddress();

  if (!address) throw new Error("MISSING_RELEASE_ADDRESS");
  const isLiquid = isLiquidAddress(address, getLiquidNetwork());
  const message = getMessageToSignForAddress(publicKey, address);
  const signature = wallet.signMessage(message, address, index);

  if (!signature)
    throw new Error(
      isLiquid ? "MISSING_SIGNATURE_LIQUID" : "MISSING_SIGNATURE",
    );

  const isValidSignature = isLiquid
    ? isValidLiquidSignature({ message, address, signature })
    : isValidBitcoinSignature({
        message,
        address,
        signature,
        network: getNetwork(),
      });
  if (!isValidSignature)
    throw new Error(
      isLiquid ? "INVALID_SIGNATURE_LIQUID" : "INVALID_SIGNATURE",
    );
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

  return {
    address,
    message,
    signature,
  };
}
