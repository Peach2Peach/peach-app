import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { BuyOffer69TradeRequest } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { TradeRequestsReceived } from "../../components/matches/TradeRequestsReceived";
import { getPaymentDataFromOffer } from "../../components/matches/utils/getPaymentDataFromOffer";
import { SellOrBuyOfferSummary } from "../../components/offer/SellOfferSummary";
import { useWalletLabel } from "../../components/offer/useWalletLabel";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useBuyOfferDetail } from "../../hooks/query/peach069/useBuyOffer";
import { useBuyOfferTradeRequestsReceived } from "../../hooks/query/peach069/useBuyOfferTradeRequests";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelBuyOffer68Popup } from "../../popups/CancelBuyOffer69Popup";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { LoadingScreen } from "../loading/LoadingScreen";

const rejectTradeRequest = async (
  buyOfferId: number,
  userId: string,
): Promise<void> => {
  await peachAPI.private.peach069.rejectBuyOfferTradeRequestReceivedByIds({
    buyOfferId,
    userId,
  });
};

const goToChat = async (
  navigation: StackNavigation,
  buyOfferId: number,
  userId: string,
): Promise<void> => {
  navigation.navigate("tradeRequestChat", {
    offerId: String(buyOfferId),
    offerType: "buy",
    requestingUserId: userId,
  });
};

const acceptTradeRequest = async (
  buyOffer: Pick<BuyOffer69, "id" | "paymentData">,
  tradeRequest: BuyOffer69TradeRequest,
  selfUser: User,
  navigation: StackNavigation,
  handleError: Function,
): Promise<void> => {
  const ress = await peachAPI.public.user.getUser({
    userId: tradeRequest.userId,
  });
  const pgpPubKeysOfRequestingUser = ress.result?.pgpPublicKeys;

  if (!pgpPubKeysOfRequestingUser)
    throw Error("missing requesting user pgp keys");

  const { paymentData } = getPaymentDataFromOffer(
    buyOffer as unknown as BuyOffer,
    tradeRequest.paymentMethod as PaymentMethod,
  );

  if (!paymentData) throw Error("did not find matching payment data");

  const symmetricKey = await decryptSymmetricKey(
    tradeRequest.symmetricKeyEncrypted,
    tradeRequest.symmetricKeySignature,
    [...selfUser.pgpPublicKeys, ...pgpPubKeysOfRequestingUser],
  );

  if (!symmetricKey) throw Error("error decrypting symmetric key");

  const encryptedPaymentData = await encryptPaymentData(
    cleanPaymentData(paymentData),
    symmetricKey,
  );

  const { result, error } =
    await peachAPI.private.peach069.acceptBuyOfferTradeRequestReceivedByIds({
      buyOfferId: buyOffer.id,
      userId: tradeRequest.userId,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    });

  if (error) {
    handleError(error);
  }

  if (result) {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: {
            screen: "home",
            params: { tab: "home" },
          },
        },
        {
          name: "contract",
          params: { contractId: result.id },
        },
      ],
    });
  }
};

export const BrowseTradeRequestsToMyBuyOffer = () => {
  const { offerId } = useRoute<"browseTradeRequestsToMyBuyOffer">().params;
  const navigation = useStackNavigation();
  const { buyOffer: buyOfferApiResp, isLoading } = useBuyOfferDetail(offerId);

  const buyOffer = buyOfferApiResp as unknown as BuyOffer69;

  const [displayedCurrency, setDisplayedCurrency] = useState<
    Currency | undefined
  >(undefined);

  useEffect(() => {
    if (displayedCurrency === undefined) {
      setDisplayedCurrency(
        buyOffer === undefined
          ? undefined
          : (Object.keys(buyOffer?.meansOfPayment ?? {})[0] as Currency),
      );
    }
  }, [buyOffer]);

  const {
    buyOfferTradeRequests,
    isLoading: isLoadingTradeRequests,
    refetch: refetchTradeRequests,
    error: buyOfferTRError,
  } = useBuyOfferTradeRequestsReceived(offerId);

  if (buyOfferTRError) {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "homeScreen",
          params: {
            screen: "home",
            params: { tab: "home" },
          },
        },
      ],
    });
  }

  if (
    isLoading ||
    isLoadingTradeRequests ||
    buyOfferTradeRequests === undefined ||
    buyOffer === undefined ||
    displayedCurrency === undefined
  )
    return <LoadingScreen />;
  return (
    <Screen
      style={!!buyOfferTradeRequests.length && tw`px-0`}
      header={
        <SearchHeader
          offerId={buyOffer.id}
          tradeRequests={buyOfferTradeRequests}
          displayedCurrency={displayedCurrency}
        />
      }
      showTradingLimit
    >
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        bounces={false}
      >
        {buyOfferTradeRequests.length ? (
          <TradeRequestsReceived
            offer={buyOffer}
            tradeRequests={buyOfferTradeRequests}
            acceptTradeRequestFunction={acceptTradeRequest}
            rejectTradeRequestFunction={rejectTradeRequest}
            refetchTradeRequests={refetchTradeRequests}
            goToChat={goToChat}
            type="buy"
          />
        ) : (
          <NoMatchesYet
            offer={buyOffer}
            setDisplayedCurrency={setDisplayedCurrency}
          />
        )}
      </PeachScrollView>
    </Screen>
  );
};

function NoMatchesYet({
  offer,
  setDisplayedCurrency,
}: {
  offer: BuyOffer69;
  setDisplayedCurrency: Function;
}) {
  return (
    <View style={tw`gap-8`}>
      <PeachText style={tw`text-center subtitle-1`}>
        {i18n("search.weWillNotifyYouTradeRequest")}
      </PeachText>

      <SellOrBuyOfferSummary
        offer={offer}
        walletLabel={<WalletLabel address={offer.releaseAddress} />}
        type="buy"
        setDisplayedCurrency={setDisplayedCurrency}
      />
    </View>
  );
}

function WalletLabel({ address }: { address: string }) {
  const walletLabel = useWalletLabel({ address });
  return (
    <PeachText style={tw`text-center subtitle-1`}>{walletLabel}</PeachText>
  );
}

function SearchHeader({
  offerId,
  tradeRequests,
  displayedCurrency,
}: {
  offerId: string;
  tradeRequests: BuyOffer69TradeRequest[];
  displayedCurrency: Currency;
}) {
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();

  const showAcceptTradeRequestPopup = useCallback(
    () => setPopup(<HelpPopup id="acceptTradeRequest" />),
    [setPopup],
  );

  const closePopup = useClosePopup();

  const cancelOffer = useCallback(
    () =>
      setPopup(
        <CancelBuyOffer68Popup
          cancelFunction={async () => {
            await peachAPI.private.peach069.deleteBuyOfferById({
              buyOfferId: String(offerId),
            });
            closePopup();
          }}
        />,
      ),
    [offerId, setPopup],
  );

  const goToEditPremium = useCallback(() => {
    navigation.navigate("editPremiumOfBuyOffer", {
      offerId,
      preferedDisplayCurrency: displayedCurrency,
    });
  }, [navigation, offerId, displayedCurrency]);

  const memoizedHeaderIcons = useMemo(() => {
    if (!offerId) return undefined;
    const icons = [{ ...headerIcons.cancel, onPress: cancelOffer }];

    if (tradeRequests.length > 0) {
      return [
        ...icons,
        {
          ...headerIcons.help,
          onPress: showAcceptTradeRequestPopup,
        },
      ];
    }
    return [{ ...headerIcons.percentBuy, onPress: goToEditPremium }, ...icons];
  }, [
    offerId,
    cancelOffer,
    showAcceptTradeRequestPopup,
    tradeRequests,
    displayedCurrency,
  ]);

  return (
    <Header title={offerIdToHex(String(offerId))} icons={memoizedHeaderIcons} />
  );
}
