import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { WarningPopup } from "../../popups/WarningPopup";
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
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { useCreateEscrow } from "../fundEscrow/hooks/useCreateEscrow";
import { PriceInfo } from "./BuyerPriceInfo";
import { AnimatedButtons } from "./MatchDetails";
import { PaidVia } from "./PaidVia";
import ChatButton from "./TradeRequestChatButton";
import { UserCard } from "./UserCard";
import { canUserInstantTrade } from "./canUserInstantTrade";
import { useIsAllowedToTradeRequestChat } from "./isAllowedToTradeRequestChat";
import { useOffer } from "./useOffer";
import { useTradeRequest } from "./useTradeRequest";
export function BuyOfferDetails() {
  const { offerId } = useRoute<"buyOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={i18n("offer.buy.details") + ` ${offerIdToHex(offerId)}`}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <BuyOfferDetailsComponent offer={offer} />
      )}
    </Screen>
  );
}

function BuyOfferDetailsComponent({ offer }: { offer: GetOfferResponseBody }) {
  const { user: selfUser } = useSelfUser();
  const { isDarkMode } = useThemeStore();
  const setPopup = useSetPopup();
  const navigation = useStackNavigation();

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    keys(offer.meansOfPayment).at(0) || "CHF",
  );
  const allPaymentMethods = getPaymentMethods(offer.meansOfPayment);
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

  const { data, refetch } = useTradeRequest(offer.id);

  const { data: isAllowedToTradeRequestData } = useIsAllowedToTradeRequestChat(
    offer.id,
  );

  const [isAllowedToChat, setIsAllowedToChat] = useState(false);

  useEffect(() => {
    setIsAllowedToChat(Boolean(isAllowedToTradeRequestData?.result));
  }, [isAllowedToTradeRequestData]);

  const [hadTradeRequest, setHadTradeRequest] = useState(false);

  useEffect(() => {
    if (!hadTradeRequest && data?.tradeRequest) {
      setHadTradeRequest(true);
    } else if (hadTradeRequest && !data?.tradeRequest) {
      navigation.navigate("homeScreen", {
        screen: "home",
      });
    }
  }, [data, navigation, hadTradeRequest]);

  const closePopup = useClosePopup();
  const showUnmatchPopup = useCallback(() => {
    const undoTradeRequest = async () => {
      await peachAPI.private.offer.undoRequestTradeWithBuyOffer({
        offerId: offer.id,
      });
      setHadTradeRequest(false);
      await refetch();
    };
    setPopup(
      <WarningPopup
        title={i18n("search.popups.unmatch.title")}
        content={i18n("search.popups.unmatch.text")}
        actions={
          <>
            <PopupAction
              label={i18n("search.popups.unmatch.confirm")}
              iconId="minusCircle"
              textStyle={tw`text-black-100`}
              onPress={async () => {
                setPopup(
                  <WarningPopup
                    title={i18n("search.popups.unmatched")}
                    actions={
                      <ClosePopupAction
                        style={tw`justify-center`}
                        textStyle={tw`text-black-100`}
                      />
                    }
                  />,
                );
                await undoTradeRequest();
              }}
            />
            <PopupAction
              label={i18n("search.popups.unmatch.neverMind")}
              textStyle={tw`text-black-100`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    );
  }, [closePopup, setPopup, offer.id, refetch]);

  return (
    <View style={tw`items-center justify-between grow`}>
      <PeachScrollView contentStyle={tw`gap-8 grow pb-16`}>
        <View style={tw`overflow-hidden rounded-2xl`}>
          {!!data?.tradeRequest && <PeachyBackground />}
          <View
            style={[
              tw`gap-8 m-1 rounded-2xl`,
              isDarkMode
                ? tw`bg-backgroundMain-dark`
                : tw`bg-primary-background-light`,
            ]}
          >
            <UserCard user={offer.user} isBuyer />

            <BuyPriceInfo
              selectedCurrency={
                data?.tradeRequest?.currency || selectedCurrency
              }
            />
            {data?.tradeRequest ? (
              <PaidVia paymentMethod={data.tradeRequest.paymentMethod} />
            ) : (
              <PaymentMethodSelector
                meansOfPayment={offer.meansOfPayment}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                selectedMethodInfo={undefined}
              />
            )}
            {!!data?.tradeRequest && (
              <>
                <View style={tw`items-center justify-center pb-6 z-99`}>
                  <Button
                    iconId="minusCircle"
                    textColor={tw.color("error-main")}
                    style={tw`bg-primary-background-light`}
                    onPress={showUnmatchPopup}
                  >
                    {i18n("match.unmatchButton")}
                  </Button>
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
      {!data?.tradeRequest && (
        <View
          style={tw`absolute bottom-0 left-0 right-0 p-2   ${isDarkMode ? "bg-backgroundMain-dark" : "bg-primary-background-light"}`}
        >
          <RequestTradeAction
            selectedPaymentData={selectedPaymentData}
            selectedCurrency={selectedCurrency}
            offerId={offer.id}
            counterparty={offer.user}
            instantTradeCriteria={offer.instantTradeCriteria}
          />
        </View>
      )}

      {isAllowedToChat && selfUser && (
        <ChatButton offerId={offer.id} requestingUserId={selfUser.id} />
      )}

      {data?.tradeRequest && <WaitingForBuyer />}
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
  instantTradeCriteria,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offerId: string;
  counterparty: PublicUser;
  instantTradeCriteria: InstantTradeCriteria | null;
}) {
  const showError = useShowErrorBanner();
  const { user } = useSelfUser();
  const { amount, premium, requestingOfferId } =
    useRoute<"buyOfferDetails">().params;
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

  const navigation = useStackNavigation();
  const queryClient = useQueryClient();
  const { mutateAsync: createEscrow } = useCreateEscrow();
  const { mutate } = useMutation({
    onMutate: async (_instantTrade: boolean) => {
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      const previousData = queryClient.getQueryData<{
        tradeRequest: TradeRequest | null;
      }>(offerKeys.tradeRequest(offerId));

      return { previousData };
    },
    mutationFn: async (instantTrade) => {
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
      if (error) throw new Error(error.error);
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
    onSettled: async (response) => {
      await queryClient.invalidateQueries({
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

  if (user === undefined) return null;

  const canInstantTrade =
    instantTradeCriteria && canUserInstantTrade(user, instantTradeCriteria);

  if (canInstantTrade) {
    return (
      <ConfirmSlider
        label1={i18n("matchDetails.action.requestTrade")}
        enabled={selectedPaymentData !== undefined}
        onConfirm={() => mutate(true)}
      />
    );
  }

  return (
    <Button
      style={tw`self-center`}
      disabled={selectedPaymentData === undefined}
      onPress={() => mutate(false)}
    >
      {i18n("matchDetails.action.requestTrade")}
    </Button>
  );
}

function BuyPriceInfo({ selectedCurrency }: { selectedCurrency: Currency }) {
  const { amount, premium, offerId, requestingOfferId } =
    useRoute<"buyOfferDetails">().params;
  const { data } = useTradeRequest(offerId);

  const { data: priceBook } = useMarketPrices();

  const amountInBTC = amount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
  const displayPrice = data?.tradeRequest
    ? data.tradeRequest.fiatPrice
    : bitcoinPrice * (1 + premium / CENT) * amountInBTC;

  const premiumOfTradeRequest = data?.tradeRequest
    ? round(
        ((round(data.tradeRequest.fiatPrice / amountInBTC, 2) - bitcoinPrice) /
          bitcoinPrice) *
          CENT,
        2,
      )
    : 0;
  return (
    <PriceInfo
      selectedCurrency={selectedCurrency}
      satsAmount={amount}
      price={displayPrice}
      premium={data?.tradeRequest ? premiumOfTradeRequest : premium}
    />
  );
}
