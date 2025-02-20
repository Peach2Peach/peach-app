import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { DrawerOptionType } from "../../components/drawer/components/DrawerOption";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { PaymentLogoType } from "../../components/payment/logos";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { useUser } from "../publicProfile/useUser";
import { PriceInfo } from "./BuyerPriceInfo";
import { useMaxMiningFee } from "./MatchDetails";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";
import { useOffer } from "./useOffer";

export function TradeRequestForBuyOffer() {
  const { userId, amount, fiatPrice, currency, paymentMethod, offerId } =
    useRoute<"tradeRequestForBuyOffer">().params;

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
        <MiningFeeWarning amount={amount} />
        <UserCard user={user} isBuyer={false} />

        <PriceInfo
          satsAmount={amount}
          selectedCurrency={currency}
          premium={premium}
          price={fiatPrice}
        />
        <PaidVia paymentMethod={paymentMethod} />
      </PeachScrollView>
      <View style={tw`flex-row items-center justify-center gap-8px`}>
        {/* <Button style={tw`flex-1 py-3 bg-error-main`}>Decline</Button> */}

        <AcceptButton
          paymentMethod={paymentMethod}
          selectedPaymentData={selectedPaymentData}
          children={"Accept Trade"}
          onPress={setSelectedPaymentData}
        />
      </View>
    </Screen>
  );
}

type PaideViaPayementMethodBubbleProps = {
  paymentMethod: PaymentMethod;
  selectedPaymentData?: PaymentData;
  children: React.ReactNode;
  onPress?: (value: PaymentData) => void;
};

function AcceptButton({
  paymentMethod,
  selectedPaymentData,
  children,
  onPress,
}: PaideViaPayementMethodBubbleProps) {
  const paymentDataRecord = usePaymentDataStore((state) => state.paymentData);
  const paymentDataForType = useMemo(
    () =>
      Object.values(paymentDataRecord).filter((p) => p.type === paymentMethod),
    [paymentDataRecord, paymentMethod],
  );

  const hasPaymentData = paymentDataForType.length > 0;
  const hasMultiplePaymentData = paymentDataForType.length > 1;
  const updateDrawer = useDrawerState((state) => state.updateDrawer);
  const onPressBubble = () => {
    if (onPress) {
      if (hasPaymentData) {
        if (hasMultiplePaymentData) {
          updateDrawer({
            title: i18n("selectPaymentMethod.title"),
            options: paymentDataForType.map(
              (p, index): DrawerOptionType => ({
                title: p.label,
                onPress: () => {
                  onPress(paymentDataForType[index]);
                  updateDrawer({ show: false });
                },
                logoID: p.type as PaymentLogoType, // Ensure logoID is correctly typed
                iconRightID:
                  p.id === selectedPaymentData?.id ? "check" : undefined,
              }),
            ),
            show: true,
          });
        } else {
          onPress(paymentDataForType[0]);
        }
      }
    }
  };
  const mutation = useAcceptTradeRequest({ selectedPaymentData });
  useEffect(() => {
    if (selectedPaymentData !== undefined) {
      mutation.mutate();
    }
  }, [selectedPaymentData, mutation]);
  const handlePress = () => {
    onPressBubble();
  };

  return (
    <Button style={tw`flex-1 py-3 bg-success-main`} onPress={handlePress}>
      {children}
    </Button>
  );
}

function useAcceptTradeRequest({
  selectedPaymentData,
}: {
  selectedPaymentData?: PaymentData;
}) {
  const { userId, offerId, amount, symmetricKeyEncrypted } =
    useRoute<"tradeRequestForBuyOffer">().params;
  const navigation = useStackNavigation();
  const { maxMiningFeeRate } = useMaxMiningFee(amount);

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

      const { result, error } =
        await peachAPI.private.offer.acceptTradeRequestForBuyOffer({
          userId,
          offerId,
          paymentData: getHashedPaymentData([selectedPaymentData]),
          paymentDataEncrypted: encryptedData.encrypted,
          paymentDataSignature: encryptedData.signature,
          maxMiningFeeRate,
        });
      if (error) {
        throw new Error(error.error);
      }
      return result;
    },
    onSuccess: (response) => {
      if (!response || "error" in response) return;
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
