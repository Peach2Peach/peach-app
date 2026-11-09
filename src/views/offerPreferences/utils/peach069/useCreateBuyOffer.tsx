import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useSetPopup } from "../../../../components/popup/GlobalPopup";
import { useSetToast } from "../../../../components/toast/Toast";
import { offerKeys } from "../../../../hooks/query/useOfferDetail";
import { useShowErrorBanner } from "../../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../../hooks/useStackNavigation";
import { InfoPopup } from "../../../../popups/InfoPopup";
import { useSettingsStore } from "../../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../../utils/account/getMessageToSignForAddress";
import i18n from "../../../../utils/i18n";
import { error } from "../../../../utils/log/error";
import { submitBuyOfferPublicKey } from "../../../../utils/offer/submitBuyOfferPublicKey";
import { parseError } from "../../../../utils/parseError";
import { filterUnavailableCurrencies } from "../../../../utils/paymentMethod/filterUnavailableCurrencies";
import { peachAPI } from "../../../../utils/peachAPI";
import { usePaymentMethods } from "../../../addPaymentMethod/usePaymentMethodInfo";
import { isValidBitcoinSignature } from "../../../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../../../utils/wallet/getNetwork";
import { peachWallet } from "../../../../utils/wallet/setWallet";

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === "FORBIDDEN" && Array.isArray(errorDetails);

export function useCreateBuyOffer({
  amount,
  meansOfPayment,
  paymentData,
  premium,
  instantTradeCriteria,
  multi,
  experienceLevelCriteria,
}: Pick<
  BuyOffer69Draft,
  | "amount"
  | "meansOfPayment"
  | "paymentData"
  | "premium"
  | "instantTradeCriteria"
  | "experienceLevelCriteria"
> & { multi?: number }) {
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const showErrorBanner = useShowErrorBanner();
  const setToast = useSetToast();
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
  const { data: paymentMethods } = usePaymentMethods();

  const getSignedAddress = async (signWithPeachWallet: boolean) => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (signWithPeachWallet) {
      // const { address, index } = await peachWallet.getAddress();
      // const message = getMessageToSignForAddress(publicKey, address);
      // return {
      //   address,
      //   message,
      //   signature: peachWallet.signMessage(message, index),
      // };
      throw Error("Tried to get Address");
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
      let releaseAddresses: string[] = [];
      let releaseAddressMessageSignatures: string[] = [];
      const howManyOffers = multi ? multi : 1;
      if (!payoutToPeachWallet) {
        for (let i = 0; i < howManyOffers; i++) {
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
          releaseAddresses.push(address);
          releaseAddressMessageSignatures.push(signature);
        }
      }

      const { meansOfPayment: filteredMeansOfPayment, didFilter } =
        filterUnavailableCurrencies(meansOfPayment, paymentData, paymentMethods);

      const finalizedOfferDraft = {
        amount,
        meansOfPayment: filteredMeansOfPayment,
        paymentData,
        premium,
        releaseAddresses: releaseAddresses ? releaseAddresses : undefined,
        releaseAddressMessageSignatures: releaseAddressMessageSignatures
          ? releaseAddressMessageSignatures
          : undefined,
        instantTradeCriteria,
        experienceLevelCriteria,
        multi,
      };

      const { result, error: err } =
        await peachAPI.private.peach069.createBuyOffer(finalizedOfferDraft);

      if (!result) {
        throw new Error(err?.error || "POST_OFFER_ERROR", {
          cause: err?.details,
        });
      }
      if (didFilter) {
        setToast({
          msgKey: "PAYMENT_METHOD_CURRENCY_FILTERED",
          color: "yellow",
        });
      }

      // The offers exist from here on: a key failure must not surface as a
      // creation failure, or pressing publish again would duplicate them.
      const ids = result.ids.map(String);
      const published = await Promise.all(
        ids.map((id) =>
          submitBuyOfferPublicKey(id).then(
            () => true,
            (e) => {
              error("submitBuyOfferPublicKey", parseError(e));
              return false;
            },
          ),
        ),
      );
      return { ids, allPublished: published.every(Boolean) };
    },
    onError: ({ message, cause }: Error) => {
      if (isForbiddenPaymentMethodError(message, cause)) {
        const paymentMethod = cause.pop();
        if (paymentMethod === "paypal") showHelp();
      } else {
        showErrorBanner(message);
      }
    },
    onSuccess: ({ ids, allPublished }) => {
      if (!allPublished) showErrorBanner("BUY_OFFER_NOT_PUBLISHED");
      const yourTrades = {
        name: "homeScreen",
        params: {
          screen: "yourTrades",
          params: { tab: "yourTrades.69BuyOffer" },
        },
      } as const;
      if (ids.length === 1) {
        navigation.reset({
          index: 1,
          routes: [
            yourTrades,
            {
              name: "browseTradeRequestsToMyBuyOffer",
              params: { offerId: ids[0] },
            },
          ],
        });
      } else {
        navigation.reset({ index: 0, routes: [yourTrades] });
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["peach069OwnBuyOffers"],
      });
      return queryClient.invalidateQueries({ queryKey: offerKeys.summaries() });
    },
  });
}
