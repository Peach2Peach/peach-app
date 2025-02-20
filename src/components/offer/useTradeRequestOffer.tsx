import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { Currency } from "../../../peach-api/src/@types/global";
import { PaymentData } from "../../../peach-api/src/@types/payment";
import { TradeRequest } from "../../../peach-api/src/private/offer/getTradeRequest";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { getRandom } from "../../utils/crypto/getRandom";
import i18n from "../../utils/i18n";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
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

