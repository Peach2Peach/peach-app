import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { type SellOfferSummary } from "../../../peach-api/src/@types/match";
import { FundingStatus } from "../../../peach-api/src/@types/offer";
import { PublicUser } from "../../../peach-api/src/@types/user";
import { TradeRequestForSellOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForSellOffer";
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
import { offerKeys } from "../../hooks/query/offerKeys";
import { useFundingStatus } from "../../hooks/query/useFundingStatus";
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
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getRandom } from "../../utils/crypto/getRandom";
import i18n from "../../utils/i18n";
import { keys } from "../../utils/object/keys";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { isValidBitcoinSignature } from "../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { peachWallet } from "../../utils/wallet/setWallet";
import { useSymmetricKeyEncrypted } from "../tradeRequestChat/useSymmetricKeyEncrypted";
import { AnimatedButtons } from "./AnimatedButtons";
import { BuyerPriceInfo } from "./BuyerPriceInfo";
import { FundingInfo } from "./FundingInfo";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { PaidVia } from "./PaidVia";
import { TradeRequestChatButton } from "./TradeRequestChatButton";
import { UserCard } from "./UserCard";
import { useMaxMiningFee } from "./useMaxMiningFee";
import { useSellOfferSummary } from "./useSellOfferSummary";
import { useTradeRequestForSellOffer } from "./useTradeRequestForSellOffer";

export function SellOffer() {
  const { offerId, requestingOfferId } = useRoute<"sellOffer">().params;
  const { data: offerSummary, isLoading: isLoadingOffer } = useSellOfferSummary(
    offerId,
    requestingOfferId,
  );
  const { data: fundingStatus, isLoading: isLoadingFundingStatus } =
    useFundingStatus(offerId);
  const { data: tradeRequest, isLoading: isLoadingTradeRequest } =
    useTradeRequestForSellOffer(offerId, requestingOfferId);
  const navigation = useStackNavigation();
  const isLoading =
    isLoadingOffer || isLoadingFundingStatus || isLoadingTradeRequest;
  if (isLoading) {
    return (
      <Screen header={`${i18n("offer.sell.details")} ${offerIdToHex(offerId)}`}>
        <ActivityIndicator size={"large"} />
      </Screen>
    );
  }

  if (!offerSummary || !fundingStatus) {
    return (
      <Screen header={`${i18n("offer.sell.details")} ${offerIdToHex(offerId)}`}>
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
          params: { screen: "yourTrades", params: { tab: "yourTrades.buy" } },
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
            ? { screen: "yourTrades", params: { tab: "yourTrades.buy" } }
            : { screen: "home" },
        },
      ],
    });
  }

  return (
    <Screen header={`${i18n("offer.sell.details")} ${offerIdToHex(offerId)}`}>
      <SellOfferSummaryComponent
        {...offerSummary}
        amount={tradeRequest?.amount || offerSummary.amount}
        meansOfPayment={
          tradeRequest
            ? {
                [tradeRequest.currency]: [tradeRequest.paymentMethod],
              }
            : offerSummary.meansOfPayment
        }
        fundingStatus={fundingStatus}
        tradeRequest={tradeRequest}
      />
    </Screen>
  );
}

const MATCH_DELAY = 5000;
type Props = SellOfferSummary & {
  fundingStatus: FundingStatus["status"];
  tradeRequest:
    | (TradeRequestForSellOffer & { amount: number })
    | null
    | undefined;
};

function SellOfferSummaryComponent({
  amount,
  meansOfPayment,
  user,
  fundingStatus,
  canInstantTrade,
  tradeRequested,
  premium,
  prices,
  tradeRequest,
}: Props) {
  const { offerId, requestingOfferId } = useRoute<"sellOffer">().params;
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

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const { data: symmetricKeyEncrypted } = useSymmetricKeyEncrypted(
    "sellOffer",
    `${offerId}-${requestingOfferId || publicKey}`,
  );

  const queryClient = useQueryClient();
  const { mutate: undoTradeRequest } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId, requestingOfferId),
      });
      await queryClient.cancelQueries({
        queryKey: offerKeys.publicSellSummary(offerId, requestingOfferId),
      });
      const tradeRequestData = queryClient.getQueryData<TradeRequest>(
        offerKeys.tradeRequest(offerId, requestingOfferId),
      );
      const sellOfferSummaryData = queryClient.getQueryData<SellOfferSummary>(
        offerKeys.publicSellSummary(offerId, requestingOfferId),
      );

      queryClient.setQueryData<TradeRequest | null>(
        offerKeys.tradeRequest(offerId, requestingOfferId),
        null,
      );
      queryClient.setQueryData<SellOfferSummary>(
        offerKeys.publicSellSummary(offerId, requestingOfferId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tradeRequested: false,
            selectedCurrency: undefined,
            requestedPrice: null,
          };
        },
      );

      return { tradeRequestData, sellOfferSummaryData };
    },
    mutationFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.undoRequestTradeWithSellOffer({
          offerId,
          requestingOfferId,
        });
      if (result) return result;
      throw new Error(error?.error);
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        offerKeys.tradeRequest(offerId, requestingOfferId),
        context?.tradeRequestData,
      );
      queryClient.setQueryData(
        offerKeys.publicSellSummary(offerId, requestingOfferId),
        context?.sellOfferSummaryData,
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: offerKeys.tradeRequest(offerId, requestingOfferId),
        }),
        queryClient.invalidateQueries({
          queryKey: offerKeys.publicSellSummary(offerId, requestingOfferId),
        }),
      ]);
    },
  });

  const [showTradeWasRequested, setShowTradeWasRequested] =
    useState(tradeRequested);

  const { maxMiningFeeRate } = useMaxMiningFee(amount);
  const { mutate: requestTrade } = useRequestTrade({
    offerId,
    selectedPaymentData,
    selectedCurrency,
    counterparty: user,
    maxMiningFeeRate,
    price: prices[selectedCurrency],
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
        <FundingInfo fundingStatus={fundingStatus} />
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
            <UserCard user={user} />

            <MiningFeeWarning amount={amount} />

            <BuyerPriceInfo
              matched={tradeRequested}
              matchedPrice={tradeRequest?.fiatPrice || null}
              prices={prices}
              amount={amount}
              premium={premium}
              selectedCurrency={selectedCurrency}
              selectedPaymentMethod={
                tradeRequest?.paymentMethod ||
                selectedPaymentData?.type ||
                allMethodsForCurrency[0]
              }
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
            {!!(showTradeWasRequested || tradeRequested) && (
              <>
                <View style={tw`items-center justify-center z-99`}>
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

      {!!symmetricKeyEncrypted && selfUser && (
        <TradeRequestChatButton
          chatRoomId={`${offerId}-${requestingOfferId || selfUser.id}`}
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
          price={prices[selectedCurrency]}
          onPress={onMatchPress}
          maxMiningFeeRate={maxMiningFeeRate}
        />
      ) : (
        <WaitingForSeller />
      )}
    </View>
  );
}

function WaitingForSeller() {
  return (
    <View style={tw`items-center self-center`}>
      <View style={tw`flex-row items-center justify-center`}>
        <PeachText style={tw`subtitle-1`}>
          {" "}
          {i18n("match.waitingForSeller")}
        </PeachText>
        <AnimatedButtons />
      </View>
      <PeachText style={tw`text-center subtitle-2`}>
        {i18n("match.waitingForSeller.text")}
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
  onPress,
  maxMiningFeeRate,
  price = 0,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offerId: string;
  counterparty: PublicUser;
  canInstantTrade: boolean;
  onPress: () => void;
  maxMiningFeeRate?: number;
  price: number | undefined;
}) {
  const { user } = useSelfUser();

  const { mutate: requestTrade } = useRequestTrade({
    offerId,
    selectedPaymentData,
    selectedCurrency,
    counterparty,
    maxMiningFeeRate,
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
        enabled={!!selectedPaymentData && !isTradingLimitReached}
        onConfirm={() => requestTrade(true)}
      />
    );
  }

  return (
    <Button
      style={[tw`self-center`, isTradingLimitReached && tw`bg-black-50`]}
      disabled={!selectedPaymentData || isTradingLimitReached}
      onPress={onPress}
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
  counterparty,
  maxMiningFeeRate,
  price,
}: {
  offerId: string;
  selectedPaymentData: PaymentData | undefined;
  selectedCurrency: Currency;
  counterparty: PublicUser;
  maxMiningFeeRate?: number;
  price?: number;
}) {
  const queryClient = useQueryClient();
  const showError = useShowErrorBanner();
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const { requestingOfferId } = useRoute<"sellOffer">().params;

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
  const getSignedAddress = async () => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (payoutToPeachWallet) {
      const { address, index } = await peachWallet.getAddress();
      const message = getMessageToSignForAddress(publicKey, address);
      return {
        address,
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

  const navigation = useStackNavigation();
  return useMutation({
    onMutate: async (_instantTrade: boolean) => {
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId, requestingOfferId),
      });
      await queryClient.cancelQueries({
        queryKey: offerKeys.publicSellSummary(offerId, requestingOfferId),
      });
      const publicSellSummaryData = queryClient.getQueryData<SellOfferSummary>(
        offerKeys.publicSellSummary(offerId, requestingOfferId),
      );
      queryClient.setQueryData<SellOfferSummary>(
        offerKeys.publicSellSummary(offerId, requestingOfferId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tradeRequested: true,
            selectedCurrency,
            requestedPrice: price ?? old.requestedPrice,
          };
        },
      );

      return { publicSellSummaryData };
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
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData.type,
        paymentData: hashedPaymentData,
        symmetricKeyEncrypted: encrypted,
        symmetricKeySignature: signature,
        paymentDataEncrypted: encryptedPaymentData.encrypted,
        paymentDataSignature: encryptedPaymentData.signature,
        instantTrade,
        requestingOfferId,
        maxMiningFeeRate,
      } as const;
      if (requestingOfferId) {
        const { result, error } =
          await peachAPI.private.offer.requestTradeWithSellOffer(data);
        if (result) return result;
        throw new Error(error?.error);
      }

      const { address, signature: messageSignature } = await getSignedAddress();

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithSellOffer({
          ...data,
          releaseAddress: address,
          messageSignature,
        });
      if (result) return result;
      throw new Error(error?.error);
    },
    onError: (error, _variables, context) => {
      showError(error);
      if (context?.publicSellSummaryData) {
        queryClient.setQueryData(
          offerKeys.publicSellSummary(offerId, requestingOfferId),
          context.publicSellSummaryData,
        );
      }
    },
    onSuccess: (response) => {
      if ("contractId" in response) {
        navigation.reset({
          index: 1,
          routes: [
            { name: "homeScreen", params: { screen: "yourTrades" } },
            { name: "contract", params: { contractId: response.contractId } },
          ],
        });
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: offerKeys.tradeRequest(offerId),
        }),
        queryClient.invalidateQueries({
          queryKey: offerKeys.publicSellSummary(offerId, requestingOfferId),
        }),
      ]),
  });
}
