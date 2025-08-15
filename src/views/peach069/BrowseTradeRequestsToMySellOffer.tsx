import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { SellOffer69TradeRequest } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { TradeRequestsReceived } from "../../components/matches/TradeRequestsReceived";
import { getPaymentDataFromOffer } from "../../components/matches/utils/getPaymentDataFromOffer";
import { SellOrBuyOfferSummary } from "../../components/offer/SellOfferSummary";
import { useWalletLabel } from "../../components/offer/useWalletLabel";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useSellOfferDetail } from "../../hooks/query/peach069/useSellOffer";
import { useSellOfferTradeRequestsReceived } from "../../hooks/query/peach069/useSellOfferTradeRequests";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
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
  sellOfferId: string,
  userId: string,
  navigation: any,
): Promise<void> => {
  await peachAPI.private.peach069.rejectSellOfferTradeRequestReceivedByIds({
    sellOfferId,
    userId,
  });
};

const goToChat = async (
  navigation: StackNavigation,
  sellOfferId: string,
  userId: string,
): Promise<void> => {
  navigation.navigate("tradeRequestChat", {
    offerId: sellOfferId,
    offerType: "sell",
    requestingUserId: userId,
  });
};

const acceptTradeRequest = async (
  sellOffer: Pick<SellOffer, "id" | "paymentData">,
  tradeRequest: SellOffer69TradeRequest,
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
    sellOffer as unknown as SellOffer,
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
    await peachAPI.private.peach069.acceptSellOfferTradeRequestReceivedByIds({
      sellOfferId: sellOffer.id,
      userId: tradeRequest.userId,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
      paymentData: "", // TODO: validate what this is in practice. maybe this only makes sense in Instant Trade
    });

  if (error) handleError(error);

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

// export function BrowseTradeRequestsToMySellOfferOLD() {
//   const navigation = useStackNavigation();

//   const { user: selfUser } = useSelfUser();

//   const { offerId } = useRoute<"browseTradeRequestsToMySellOffer">().params;
//   const title = "Peach69 Sell Offer " + offerId;

//   const { sellOffer, isLoading } = useSellOfferDetail(offerId);
//   const { sellOfferTradeRequests, isLoading: isLoadingTradeRequests } =
//     useSellOfferTradeRequestsReceived(offerId);

//   return (
//     <Screen header={<Header title={title} />}>
//       <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
//         <PeachText>0.69 Peach Sell Offer </PeachText>
//         <PeachText>Offer ID: {offerId}</PeachText>
//         {!isLoading && (
//           <>
//             <PeachText>Amount: {sellOffer?.amount}</PeachText>
//             <PeachText>
//               Means of Payment: {JSON.stringify(sellOffer?.meansOfPayment)}
//             </PeachText>
//           </>
//         )}
//         <>
//           {!isLoadingTradeRequests &&
//             !!sellOfferTradeRequests &&
//             !!sellOffer &&
//             !!selfUser &&
//             sellOfferTradeRequests.map((item, index) => {
//               return (
//                 <>
//                   <PeachText>-------</PeachText>
//                   <PeachText>TR ID: {item.id}</PeachText>
//                   <PeachText>TR User: {item.userId}</PeachText>
//                   <PeachText>TR Price: {item.price}</PeachText>
//                   <PeachText>TR Currency: {item.currency}</PeachText>
//                   <PeachText>TR PM: {item.paymentMethod}</PeachText>
//                   <View style={tw`flex-row gap-10px`}>
//                     <Button
//                       style={[tw`bg-success-main`]}
//                       onPress={() =>
//                         acceptTradeRequest(
//                           sellOffer,
//                           item,
//                           selfUser,
//                           navigation,
//                         )
//                       }
//                     >
//                       accept
//                     </Button>
//                     <Button
//                       style={[tw`bg-error-main`]}
//                       onPress={() =>
//                         rejectTradeRequest(
//                           item.sellOfferId,
//                           item.userId,
//                           navigation,
//                         )
//                       }
//                     >
//                       reject
//                     </Button>
//                     <Button
//                       style={[tw`bg-error-main`]}
//                       onPress={() =>
//                         goToChat(navigation, item.sellOfferId, item.userId)
//                       }
//                     >
//                       chat
//                     </Button>
//                   </View>
//                   <PeachText>-------</PeachText>
//                 </>
//               );
//             })}
//         </>
//       </PeachScrollView>
//     </Screen>
//   );
// }

////

// new component
export const BrowseTradeRequestsToMySellOffer = () => {
  const { offerId } = useRoute<"browseTradeRequestsToMySellOffer">().params;

  const { sellOffer, isLoading } = useSellOfferDetail(offerId);
  const {
    sellOfferTradeRequests,
    isLoading: isLoadingTradeRequests,
    refetch: refetchTradeRequests,
  } = useSellOfferTradeRequestsReceived(offerId);

  if (
    isLoading ||
    isLoadingTradeRequests ||
    sellOfferTradeRequests === undefined ||
    sellOffer === undefined
  )
    return <LoadingScreen />;
  return (
    <Screen
      style={!!sellOfferTradeRequests.length && tw`px-0`}
      header={
        <SearchHeader
          offer={sellOffer}
          tradeRequests={sellOfferTradeRequests}
        />
      }
      showTradingLimit
    >
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        bounces={false}
      >
        {sellOfferTradeRequests.length ? (
          <TradeRequestsReceived
            offer={sellOffer}
            tradeRequests={sellOfferTradeRequests}
            acceptTradeRequestFunction={acceptTradeRequest}
            rejectTradeRequestFunction={rejectTradeRequest}
            refetchTradeRequests={refetchTradeRequests}
            goToChat={goToChat}
            type="sell"
          />
        ) : (
          <NoMatchesYet offer={sellOffer} />
        )}
      </PeachScrollView>
    </Screen>
  );
};

function NoMatchesYet({ offer }: { offer: SellOffer }) {
  return (
    <View style={tw`gap-8`}>
      <PeachText style={tw`text-center subtitle-1`}>
        {i18n("search.weWillNotifyYouTradeRequest")}
      </PeachText>

      <SellOrBuyOfferSummary
        offer={offer}
        walletLabel={<WalletLabel address={offer.returnAddress} />}
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
  offer,
  tradeRequests,
}: {
  offer: SellOffer;
  tradeRequests: SellOffer69TradeRequest[];
}) {
  const offerId = offer.id;
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();

  const showAcceptTradeRequestPopup = useCallback(
    () => setPopup(<HelpPopup id="acceptTradeRequest" />),
    [setPopup],
  );
  // const showSortAndFilterPopup = useCallback(
  //   () => setPopup(<SellSorters />),
  //   [setPopup],
  // );
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );

  const goToEditPremium = useCallback(
    () => navigation.navigate("editPremium", { offerId }),
    [navigation, offerId],
  );

  const memoizedHeaderIcons = useMemo(() => {
    if (!offer) return undefined;
    const icons = [
      // { ...headerIcons.sellFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.percent, onPress: goToEditPremium },
      { ...headerIcons.cancel, onPress: cancelOffer },
    ];

    if (tradeRequests.length > 0) {
      return [
        ...icons,
        {
          ...headerIcons.help,
          onPress: showAcceptTradeRequestPopup,
        },
      ];
    }
    return icons;
  }, [
    offer,
    cancelOffer,
    goToEditPremium,
    showAcceptTradeRequestPopup,
    tradeRequests,
  ]);

  return <Header title={offerIdToHex(offerId)} icons={memoizedHeaderIcons} />;
}
