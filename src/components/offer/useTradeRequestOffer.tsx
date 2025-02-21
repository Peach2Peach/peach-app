import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { Currency } from "../../../peach-api/src/@types/global";
import { PaymentData } from "../../../peach-api/src/@types/payment";
import { TradeRequest } from "../../../peach-api/src/private/offer/getTradeRequest";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { getRandom } from "../../utils/crypto/getRandom";
import i18n from "../../utils/i18n";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { isValidBitcoinSignature } from "../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { peachWallet } from "../../utils/wallet/setWallet";
import { useCreateEscrow } from "../../views/fundEscrow/hooks/useCreateEscrow";
import { useSetToast } from "../toast/Toast";

export function useTradeRequestBuyOffer(
  selectedCurrency: Currency,
  selectedPaymentData: PaymentData | undefined,
  offerId: string,
  counterparty: PublicUser,
  amount: number,
  premium: number,
  requestingOfferId?: string,
) {
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const [refundToPeachWallet, refundAddress] = useSettingsStore(
    (state) => [state.refundToPeachWallet, state.refundAddress],
    shallow,
  );
  const getAddress = async () => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    const address = refundToPeachWallet
      ? (await peachWallet.getAddress()).address
      : refundAddress;
    if (!address) throw new Error("MISSING_REFUND_ADDRESS");
    return address;
  };

  const { data: priceBook } = useMarketPrices();
  const setToast = useSetToast();
  const navigation = useStackNavigation();
  const queryClient = useQueryClient();
  const { mutateAsync: createEscrow } = useCreateEscrow();

  return useMutation({
    onMutate: async (_instantTrade: boolean) => {
      const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
      const tradeRequest = {
        amount,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData?.type,
        fiatPrice: (bitcoinPrice * (1 + premium / CENT) * amount) / SATSINBTC,
      };
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      const previousData = queryClient.getQueryData<{
        tradeRequest: TradeRequest | null;
      }>(offerKeys.tradeRequest(offerId));

      queryClient.setQueryData(offerKeys.tradeRequest(offerId), {
        tradeRequest,
      });

      return { previousData };
    },
    mutationFn: async (instantTrade: boolean) => {
      if (!selectedPaymentData) throw new Error("MISSING_VALUES");

      const SYMMETRIC_KEY_BYTES = 32;
      const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString(
        "hex",
      );
      const { encrypted, signature } = await signAndEncrypt(
        symmetricKey,
        [
          ...pgpPublicKeys,
          ...counterparty.pgpPublicKeys.map((pgp) => pgp.publicKey),
        ].join("\n"),
      );

      const encryptedPaymentData = await encryptPaymentData(
        cleanPaymentData(selectedPaymentData),
        symmetricKey,
      );
      if (!encryptedPaymentData)
        throw new Error("PAYMENTDATA_ENCRYPTION_FAILED");
      const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithBuyOffer({
          offerId,
          amount,
          premium,
          currency: selectedCurrency,
          paymentMethod: selectedPaymentData.type,
          paymentData: hashedPaymentData,
          refundAddress: await getAddress(),
          symmetricKeyEncrypted: encrypted,
          symmetricKeySignature: signature,
          paymentDataEncrypted: encryptedPaymentData.encrypted,
          paymentDataSignature: encryptedPaymentData.signature,
          instantTrade,
          requestingOfferId,
        });
      if (error) {
        setToast({
          msgKey: i18n("error.general"),
          color: "red",
        });
      }
      return result;
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          offerKeys.tradeRequest(offerId),
          context.previousData,
        );
      }
    },
    onSettled: async (response) => {
      queryClient.invalidateQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      if (response && "contractId" in response && response.contractId) {
        await createEscrow([
          getSellOfferIdFromContract({ id: response.contractId }),
        ]);
        navigation.reset({
          index: 1,
          routes: [
            {
              name: "homeScreen",
              params: {
                screen: "yourTrades",
                params: { tab: "yourTrades.sell" },
              },
            },
            { name: "contract", params: { contractId: response.contractId } },
          ],
        });
      }
    },
  });
}

export function useTradeRequestSellOffer({
  selectedCurrency,
  selectedPaymentData,
  offer,
  requestingOfferId,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offer: GetOfferResponseBody;
  requestingOfferId?: string;
}) {
  const { id: offerId, user: counterparty, amount } = offer;
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];

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

  const showError = useShowErrorBanner();

  const getSignedAddress = async () => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (payoutToPeachWallet) {
      const { address, index } = await peachWallet.getAddress();
      const message = getMessageToSignForAddress(publicKey, address);
      return {
        address,
        message,
        signature: peachWallet.signMessage(message, index),
      };
    }
    if (!payoutAddress) throw new Error("MISSING_RELEASE_ADDRESS");
    if (!payoutAddressSignature) throw new Error("MISSING_SIGNATURE");
    const message = getMessageToSignForAddress(publicKey, payoutAddress);
    if (
      !isValidBitcoinSignature({
        message,
        address: payoutAddress,
        signature: payoutAddressSignature,
        network: getNetwork(),
      })
    ) {
      throw new Error("INVALID_SIGNATURE");
    }
    return {
      address: payoutAddress,
      signature: payoutAddressSignature,
    };
  };
  const setToast = useSetToast();
  const navigation = useStackNavigation();
  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async (_instantTrade: boolean) => {
      const tradeRequst = {
        amount,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData?.type,
        fiatPrice: offer.prices?.[selectedCurrency],
      };
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      const previousData = queryClient.getQueryData(
        offerKeys.tradeRequest(offerId),
      );
      queryClient.setQueryData(offerKeys.tradeRequest(offerId), tradeRequst);
      return { previousData };
    },
    mutationFn: async (instantTrade: boolean) => {
      if (!selectedPaymentData) throw new Error("MISSING_VALUES");

      const SYMMETRIC_KEY_BYTES = 32;
      const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString(
        "hex",
      );
      const { encrypted, signature } = await signAndEncrypt(
        symmetricKey,
        [
          ...pgpPublicKeys,
          ...counterparty.pgpPublicKeys.map((pgp) => pgp.publicKey),
        ].join("\n"),
      );

      const encryptedPaymentData = await encryptPaymentData(
        cleanPaymentData(selectedPaymentData),
        symmetricKey,
      );
      if (!encryptedPaymentData)
        throw new Error("PAYMENTDATA_ENCRYPTION_FAILED");
      const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

      const { address, signature: messageSignature } = await getSignedAddress();

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithSellOffer({
          offerId,
          currency: selectedCurrency,
          paymentMethod: selectedPaymentData.type,
          paymentData: hashedPaymentData,
          symmetricKeyEncrypted: encrypted,
          symmetricKeySignature: signature,
          paymentDataEncrypted: encryptedPaymentData.encrypted,
          paymentDataSignature: encryptedPaymentData.signature,
          releaseAddress: address,
          messageSignature,
          instantTrade,
          requestingOfferId,
        });
      if (error) {
        setToast({
          msgKey: i18n("error.general"),
          color: "red",
        });
      }
      return result;
    },
    onError: (error, _variables, context) => {
      showError(error);
      if (context?.previousData) {
        queryClient.setQueryData(
          offerKeys.tradeRequest(offerId),
          context.previousData,
        );
      }
    },
    onSettled: (response) => {
      queryClient.invalidateQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      if (response && "contractId" in response) {
        navigation.reset({
          index: 1,
          routes: [
            { name: "homeScreen", params: { screen: "yourTrades" } },
            { name: "contract", params: { contractId: response.contractId } },
          ],
        });
      }
    },
  });
}
