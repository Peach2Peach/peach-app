import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { type BuyOfferSummary } from "../../../peach-api/src/@types/match";
import { PaymentMethod } from "../../../peach-api/src/@types/payment";
import { TradeRequestForBuyOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForBuyOffer";
import { ErrorBox } from "../../components/ErrorBox";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { UnmatchButton } from "../../components/matches/buttons/UnmatchButton";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { useInterruptibleFunction } from "../../components/matches/hooks/useInterruptibleFunction";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { useCHFTradingLimits } from "../../hooks/query/useCHFTradingLimits";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useTradingLimits } from "../../hooks/query/useTradingLimits";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useConfigStore } from "../../store/configStore/configStore";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { getRandom } from "../../utils/crypto/getRandom";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethodInfo } from "../../utils/paymentMethod/getPaymentMethodInfo";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { usePaymentMethodInfo } from "../addPaymentMethod/usePaymentMethodInfo";
import { useCreateEscrow } from "../fundEscrow/hooks/useCreateEscrow";
import { AnimatedButtons } from "./AnimatedButtons";
import { PriceInfo } from "./BuyerPriceInfo";
import { PaidVia } from "./PaidVia";
import { ChatButton } from "./TradeRequestChatButton";
import { UserCard } from "./UserCard";
import { useIsAllowedToTradeRequestChat } from "./isAllowedToTradeRequestChat";
import { useBuyOfferSummary } from "./useBuyOfferSummary";
import { useTradeRequestForBuyOffer } from "./useTradeRequestForBuyOffer";

export function BuyOffer() {
  const { offerId, requestingOfferId } = useRoute<"buyOffer">().params;
  const { data: offerSummary, isLoading: isLoadingOffer } = useBuyOfferSummary(
    offerId,
    requestingOfferId,
  );
  const { data: tradeRequest, isLoading: isLoadingTradeRequest } =
    useTradeRequestForBuyOffer(offerId, requestingOfferId);

  const navigation = useStackNavigation();
  const isLoading = isLoadingOffer || isLoadingTradeRequest;
  if (isLoading) {
    return (
      <Screen header={`${i18n("offer.buy.details")} ${offerIdToHex(offerId)}`}>
        <ActivityIndicator size={"large"} />
      </Screen>
    );
  }
  if (!offerSummary) {
    return (
      <Screen header={`${i18n("offer.buy.details")} ${offerIdToHex(offerId)}`}>
        <ErrorBox message="Failed to load offer" />
      </Screen>
    );
  }
  if (offerSummary.contractId) {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.sell" } },
        },
        { name: "contract", params: { contractId: offerSummary.contractId } },
      ],
    });
  } else if (!offerSummary.online) {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "homeScreen",
          params: requestingOfferId
            ? { screen: "yourTrades", params: { tab: "yourTrades.sell" } }
            : { screen: "home" },
        },
      ],
    });
  }
  return (
    <Screen header={`${i18n("offer.buy.details")} ${offerIdToHex(offerId)}`}>
      <BuyOfferSummaryComponent
        {...offerSummary}
        meansOfPayment={
          tradeRequest
            ? {
                [tradeRequest.currency]: [tradeRequest.paymentMethod],
              }
            : offerSummary.meansOfPayment
        }
        tradeRequest={tradeRequest}
      />
    </Screen>
  );
}

const MATCH_DELAY = 5000;
type Props = BuyOfferSummary & {
  tradeRequest?: TradeRequestForBuyOffer | null;
};

function BuyOfferSummaryComponent({
  meansOfPayment,
  user,
  canInstantTrade,
  amount,
  tradeRequested,
  tradeRequest,
}: Props) {
  const { offerId, requestingOfferId, premium } = useRoute<"buyOffer">().params;
  const { user: selfUser } = useSelfUser();
  const { isDarkMode } = useThemeStore();

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    keys(meansOfPayment).at(0) || "CHF",
  );
  const allPaymentMethods = tradeRequest
    ? [tradeRequest.paymentMethod]
    : getPaymentMethods(meansOfPayment);
  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const paymentData = usePaymentDataStore((state) =>
    Object.values(state.paymentData),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);

  const { data: isAllowedToTradeRequestData } =
    useIsAllowedToTradeRequestChat(offerId);

  const queryClient = useQueryClient();
  const { mutate: undoTradeRequest } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: tradeRequestKeys.tradeRequestForBuyOffer(
          offerId,
          requestingOfferId,
        ),
      });
      await queryClient.cancelQueries({
        queryKey: offerKeys.publicBuySummary(offerId, requestingOfferId),
      });
      const tradeRequestData = queryClient.getQueryData<TradeRequest | null>(
        tradeRequestKeys.tradeRequestForBuyOffer(offerId, requestingOfferId),
      );
      const publicBuySummaryData = queryClient.getQueryData<BuyOfferSummary>(
        offerKeys.publicBuySummary(offerId, requestingOfferId),
      );

      queryClient.setQueryData(
        tradeRequestKeys.tradeRequestForBuyOffer(offerId, requestingOfferId),
        null,
      );
      queryClient.setQueryData<BuyOfferSummary>(
        offerKeys.publicBuySummary(offerId, requestingOfferId),
        (data) => {
          if (!data) return data;
          return {
            ...data,
            tradeRequested: false,
            selectedCurrency: undefined,
            requestedPrice: null,
          };
        },
      );

      return { tradeRequestData, publicBuySummaryData };
    },
    mutationFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.undoRequestTradeWithBuyOffer({
          offerId,
          requestingOfferId,
        });
      if (result) return result;
      throw new Error(error?.error);
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        tradeRequestKeys.tradeRequestForBuyOffer(offerId, requestingOfferId),
        context?.tradeRequestData,
      );
      queryClient.setQueryData<BuyOfferSummary>(
        offerKeys.publicBuySummary(offerId, requestingOfferId),
        context?.publicBuySummaryData,
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tradeRequestKeys.tradeRequestForBuyOffer(
            offerId,
            requestingOfferId,
          ),
        }),
        queryClient.invalidateQueries({
          queryKey: offerKeys.publicBuySummary(offerId, requestingOfferId),
        }),
      ]);
    },
  });

  const [showTradeWasRequested, setShowTradeWasRequested] =
    useState(tradeRequested);
  const selectedPaymentMethod =
    tradeRequest?.paymentMethod ||
    selectedPaymentData?.type ||
    Object.values(meansOfPayment)[0][0];
  const adjustedSatsAmount = useTradingLimitAdjustedSatsAmount(
    amount,
    premium,
    selectedPaymentMethod,
  );

  const { data: priceBook } = useMarketPrices();

  const amountInBTC = adjustedSatsAmount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
  const displayPrice = getDisplayPrice({
    tradeRequest,
    paymentMethod: selectedPaymentMethod,
    bitcoinPrice,
    amountInBTC,
    premium,
  });
  const { mutate: requestTrade } = useRequestTrade({
    offerId,
    selectedPaymentData,
    selectedCurrency,
    counterparty: user,
    amountRange: amount,
    selectedPaymentMethod,
    price: displayPrice,
  });

  const { interruptibleFn: matchFunction, interrupt: interruptMatchFunction } =
    useInterruptibleFunction(() => {
      requestTrade(false, {
        onError: () => {
          setShowTradeWasRequested(false);
        },
      });
    }, MATCH_DELAY);
  const onInterruptMatch = () => {
    interruptMatchFunction();
    setShowTradeWasRequested(false);
  };
  const onMatchPress = () => {
    setShowTradeWasRequested(true);
    matchFunction();
  };
  return (
    <View style={tw`gap-4 shrink`}>
      <PeachScrollView contentStyle={tw`gap-8 pb-16`}>
        <View style={tw`overflow-hidden rounded-2xl`}>
          {!!(showTradeWasRequested || tradeRequested) && <PeachyBackground />}
          <View
            style={[
              tw`gap-8 m-1 rounded-2xl`,
              isDarkMode
                ? tw`bg-backgroundMain-dark`
                : tw`bg-primary-background-light`,
            ]}
          >
            <UserCard user={user} isBuyer />

            <BuyPriceInfo
              selectedCurrency={tradeRequest?.currency || selectedCurrency}
              amount={amount}
              paymentMethod={selectedPaymentMethod}
              tradeRequest={tradeRequest}
              premium={premium}
              displayPrice={displayPrice}
            />
            {showTradeWasRequested || tradeRequest ? (
              <PaidVia
                paymentMethod={
                  tradeRequest?.paymentMethod || selectedPaymentData?.type
                }
              />
            ) : (
              <PaymentMethodSelector
                meansOfPayment={meansOfPayment}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                selectedMethodInfo={undefined}
              />
            )}
            {!!(showTradeWasRequested || tradeRequest) && (
              <>
                <View style={tw`items-center justify-center pb-6 z-99`}>
                  <UnmatchButton
                    tradeRequested={tradeRequested}
                    interruptTradeRequest={onInterruptMatch}
                    setShowTradeRequested={setShowTradeWasRequested}
                    undoTradeRequest={undoTradeRequest}
                  />
                </View>
                <View
                  style={tw`absolute top-0 left-0 w-full h-full opacity-75 rounded-xl`}
                  pointerEvents="none"
                >
                  <PeachyGradient />
                </View>
              </>
            )}
          </View>
        </View>
      </PeachScrollView>

      {!!isAllowedToTradeRequestData?.symmetricKeyEncrypted && selfUser && (
        <ChatButton
          offerId={offerId}
          requestingUserId={selfUser.id}
          style={tw`self-center`}
        />
      )}

      {!tradeRequest && !showTradeWasRequested ? (
        <RequestTradeAction
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          offerId={offerId}
          counterparty={user}
          canInstantTrade={canInstantTrade}
          amountRange={amount}
          onPress={onMatchPress}
          selectedPaymentMethod={selectedPaymentMethod}
          price={displayPrice}
        />
      ) : (
        <WaitingForBuyer />
      )}
    </View>
  );
}

function WaitingForBuyer() {
  return (
    <View style={tw`items-center self-center`}>
      <View style={tw`flex-row items-center justify-center`}>
        <PeachText style={tw`subtitle-1`}>
          {i18n("match.waitingForBuyer")}
        </PeachText>
        <AnimatedButtons />
      </View>
      <PeachText style={tw`text-center subtitle-2`}>
        {i18n("match.waitingForBuyer.text")}
      </PeachText>
    </View>
  );
}

function RequestTradeAction({
  selectedCurrency,
  selectedPaymentData,
  offerId,
  counterparty,
  canInstantTrade,
  amountRange,
  onPress,
  selectedPaymentMethod,
  price = 0,
}: {
  selectedCurrency: Currency;
  selectedPaymentData?: PaymentData;
  offerId: string;
  counterparty: PublicUser;
  canInstantTrade: boolean;
  amountRange: [number, number];
  onPress: () => void;
  selectedPaymentMethod: PaymentMethod;
  price?: number;
}) {
  const { user } = useSelfUser();

  const { mutate: requestTrade } = useRequestTrade({
    offerId,
    selectedPaymentData,
    selectedCurrency,
    amountRange,
    counterparty,
    selectedPaymentMethod,
    price,
  });
  const limits = useTradingLimits(selectedCurrency);
  const isAnonymous = useConfigStore(
    (state) =>
      state.paymentMethods.find((p) => p.id === selectedPaymentData?.type)
        ?.anonymous,
  );
  if (user === undefined) return null;

  const isTradingLimitReached =
    limits.dailyAmount + price > limits.daily ||
    limits.yearlyAmount + price > limits.yearly ||
    (limits.monthlyAnonymousAmount + price > limits.monthlyAnonymous &&
      isAnonymous);

  if (canInstantTrade) {
    return (
      <ConfirmSlider
        label1={i18n(
          isTradingLimitReached
            ? "matchDetails.action.tradingLimitReached"
            : "matchDetails.action.instantTrade",
        )}
        enabled={!isTradingLimitReached && !!selectedPaymentData}
        onConfirm={() => requestTrade(true)}
      />
    );
  }

  return (
    <Button
      style={[tw`self-center`, isTradingLimitReached && tw`bg-black-50`]}
      onPress={onPress}
      disabled={isTradingLimitReached || !selectedPaymentData}
    >
      {i18n(
        isTradingLimitReached
          ? "matchDetails.action.tradingLimitReached"
          : "matchDetails.action.requestTrade",
      )}
    </Button>
  );
}

function useRequestTrade({
  offerId,
  selectedPaymentData,
  selectedCurrency,
  amountRange,
  counterparty,
  selectedPaymentMethod,
  price,
}: {
  offerId: string;
  selectedPaymentData: PaymentData | undefined;
  selectedCurrency: Currency;
  amountRange: [number, number];
  counterparty: PublicUser;
  selectedPaymentMethod: PaymentMethod;
  price?: number;
}) {
  const queryClient = useQueryClient();
  const showError = useShowErrorBanner();
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const { premium, requestingOfferId } = useRoute<"buyOffer">().params;
  const amount = useTradingLimitAdjustedSatsAmount(
    amountRange,
    premium,
    selectedPaymentMethod,
  );

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

  const navigation = useStackNavigation();
  const { mutateAsync: createEscrow } = useCreateEscrow();
  return useMutation({
    onMutate: async (_instantTrade: boolean) => {
      await queryClient.cancelQueries({
        queryKey: tradeRequestKeys.tradeRequestForBuyOffer(offerId),
      });
      await queryClient.cancelQueries({
        queryKey: offerKeys.publicBuySummary(offerId, requestingOfferId),
      });
      const publicBuySummaryData = queryClient.getQueryData<BuyOfferSummary>(
        offerKeys.publicBuySummary(offerId, requestingOfferId),
      );
      queryClient.setQueryData<BuyOfferSummary>(
        offerKeys.publicBuySummary(offerId, requestingOfferId),
        (data) => {
          if (!data) return data;
          return {
            ...data,
            tradeRequested: true,
            selectedCurrency,
            requestedPrice: price ?? data.requestedPrice,
          };
        },
      );

      return { publicBuySummaryData };
    },
    mutationFn: async (instantTrade) => {
      if (!selectedPaymentData) throw new Error("MISSING_PAYMENT_DATA");

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

      const data = {
        offerId,
        amount,
        premium,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData.type,
        paymentData: hashedPaymentData,
        symmetricKeyEncrypted: encrypted,
        symmetricKeySignature: signature,
        paymentDataEncrypted: encryptedPaymentData.encrypted,
        paymentDataSignature: encryptedPaymentData.signature,
        instantTrade,
        requestingOfferId,
      };
      if (requestingOfferId) {
        const { result, error } =
          await peachAPI.private.offer.requestTradeWithBuyOffer(data);
        if (result) return result;
        throw new Error(error?.error);
      }

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithBuyOffer({
          ...data,
          refundAddress: await getAddress(),
        });
      if (result) return result;
      throw new Error(error?.error);
    },
    onError: (error, _variables, context) => {
      showError(error);
      if (context?.publicBuySummaryData) {
        queryClient.setQueryData(
          offerKeys.publicBuySummary(offerId, requestingOfferId),
          context.publicBuySummaryData,
        );
      }
    },
    onSuccess: async (response) => {
      if ("contractId" in response) {
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
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: offerKeys.publicBuySummary(offerId, requestingOfferId),
        }),
        queryClient.invalidateQueries({
          queryKey: tradeRequestKeys.tradeRequestForBuyOffer(
            offerId,
            requestingOfferId,
          ),
        }),
      ]),
  });
}

function useTradingLimitAdjustedSatsAmount(
  amount: [number, number],
  premium: number,
  paymentMethod: PaymentMethod,
) {
  const { data: paymentMethodInfo } = usePaymentMethodInfo(paymentMethod);
  const { data: limits } = useCHFTradingLimits();
  const { data: marketPrices } = useMarketPrices();
  if (paymentMethodInfo?.anonymous === false) return amount[1];
  const maxAnonymousCHFAmount = limits
    ? limits?.monthlyAnonymous - limits?.monthlyAnonymousAmount
    : 0;
  const maxAnonymousSatsAmount = marketPrices?.CHF
    ? Math.floor(
        (maxAnonymousCHFAmount / (marketPrices.CHF * (1 + premium / CENT))) *
          SATSINBTC,
      )
    : 0;

  return Math.max(amount[0], Math.min(amount[1], maxAnonymousSatsAmount));
}

function BuyPriceInfo({
  selectedCurrency,
  amount,
  paymentMethod,
  tradeRequest,
  premium,
  displayPrice,
}: {
  selectedCurrency: Currency;
  amount: [number, number];
  paymentMethod: PaymentMethod;
  tradeRequest?: TradeRequestForBuyOffer | null;
  premium: number;
  displayPrice: number;
}) {
  const adjustedSatsAmount = useTradingLimitAdjustedSatsAmount(
    amount,
    premium,
    paymentMethod,
  );

  const { data: priceBook } = useMarketPrices();

  const amountInBTC = adjustedSatsAmount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;

  const premiumOfTradeRequest = tradeRequest
    ? round(
        ((round(tradeRequest.fiatPrice / amountInBTC, 2) - bitcoinPrice) /
          bitcoinPrice) *
          CENT,
        2,
      )
    : premium;
  return (
    <PriceInfo
      satsAmount={adjustedSatsAmount}
      selectedCurrency={selectedCurrency}
      premium={premiumOfTradeRequest}
      price={displayPrice}
    />
  );
}

function getDisplayPrice({
  tradeRequest,
  paymentMethod,
  bitcoinPrice,
  amountInBTC,
  premium,
}: {
  tradeRequest?: TradeRequestForBuyOffer | null;
  paymentMethod: PaymentMethod;
  bitcoinPrice: number;
  amountInBTC: number;
  premium: number;
}) {
  const shouldBeRounded = getPaymentMethodInfo(paymentMethod)?.rounded;
  if (tradeRequest) {
    return tradeRequest.fiatPrice;
  }
  const price = bitcoinPrice * (1 + premium / CENT) * amountInBTC;
  if (shouldBeRounded) {
    return Math.round(price);
  }
  return price;
}
