import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { round } from "../../utils/math/round";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { PriceInfo } from "../explore/BuyerPriceInfo";
import { PaidViaAcceptRequest } from "../explore/PaidViaAcceptRequest";
import { UserCard } from "../explore/UserCard";
import { useOffer } from "../explore/useOffer";
import { useUser } from "../publicProfile/useUser";

export function TradeRequestForSellOffer() {
  const { userId, amount, fiatPrice, currency, paymentMethod, offerId } =
    useRoute<"tradeRequestForSellOffer">().params;

  const { user } = useUser(userId);
  const { data: marketPrices } = useMarketPrices();
  const { data: offer } = useOffer(offerId);
  const paymentData = usePaymentDataStore((state) =>
    Object.values(state.paymentData),
  );

  const allPaymentMethods = offer
    ? getPaymentMethods(offer.meansOfPayment)
    : [];
  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, currency),
  );

  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );

  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);

  if (!user || !marketPrices || !offer) {
    return <ActivityIndicator />;
  }

  const bitcoinPrice = marketPrices[currency];
  if (!bitcoinPrice) return <ActivityIndicator />;

  const bitcoinPriceOfOffer = fiatPrice / (amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <Screen header={<Header title="trade request" />}>
      <PeachScrollView
        contentStyle={tw`items-center justify-center gap-8 grow`}
      >
        <UserCard user={user} isBuyer />

        <PriceInfo
          satsAmount={amount}
          selectedCurrency={currency}
          premium={premium}
          price={fiatPrice}
        />
        <PaidViaAcceptRequest
          paymentMethod={paymentMethod}
          setSelectedPaymentData={setSelectedPaymentData}
        />
      </PeachScrollView>
      <View style={tw`flex-row items-center justify-center gap-8px`}>
        {/* <Button style={tw`flex-1 py-3 bg-error-main`}>Decline</Button> */}
        {selectedPaymentData && (
          <AcceptButton selectedPaymentData={selectedPaymentData} />
        )}
      </View>
    </Screen>
  );
}

function AcceptButton({
  selectedPaymentData,
}: {
  selectedPaymentData: PaymentData;
}) {
  const mutation = useAcceptTradeRequest({ selectedPaymentData });
  return (
    <Button
      style={tw`flex-1 py-3 bg-success-main`}
      onPress={() => mutation.mutate()}
    >
      Accept Trade
    </Button>
  );
}

function useAcceptTradeRequest({
  selectedPaymentData,
}: {
  selectedPaymentData: PaymentData;
}) {
  const {
    userId,
    offerId,
    symmetricKeyEncrypted,
    currency,
    paymentMethod,
    matchingOfferId,
    isMatch = false,
  } = useRoute<"tradeRequestForSellOffer">().params;
  const navigation = useStackNavigation();

  return useMutation({
    onMutate: async () => {
      // cancel queries related to the sell offer
    },
    mutationFn: async () => {
      const symmetricKey = await decryptSymmetricKey(symmetricKeyEncrypted);
      if (!symmetricKey) throw new Error("SYMMETRIC_KEY_DECRYPTION_FAILED");

      if (!selectedPaymentData) throw new Error("PAYMENTDATA_NOT_FOUND");

      const encryptedData = await encryptPaymentData(
        cleanPaymentData(selectedPaymentData),
        symmetricKey,
      );
      if (!encryptedData) throw new Error("PAYMENTDATA_ENCRYPTION_FAILED");

      const { result, error } = isMatch
        ? await peachAPI.private.offer.matchOffer({
            offerId,
            matchingOfferId: matchingOfferId as string,
            currency,
            paymentMethod,
            paymentDataEncrypted: encryptedData.encrypted,
            paymentDataSignature: encryptedData.signature,
          })
        : await peachAPI.private.offer.acceptTradeRequestForSellOffer({
            userId,
            offerId,
            paymentDataEncrypted: encryptedData.encrypted,
            paymentDataSignature: encryptedData.signature,
          });
      if (error) {
        throw new Error(error.error);
      }
      return result;
    },
    onSuccess: (response) => {
      if (!response || "error" in response || !("contractId" in response))
        return;
      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "yourTrades" } },
          { name: "contract", params: { contractId: response.contractId } },
        ],
      });
    },
    onSettled: () => {
      // invalidate queries related to the sell offer
    },
  });
}
