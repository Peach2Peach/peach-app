import { View } from "react-native";
import { SellOffer69TradeRequest } from "../../../peach-api/src/@types/offer";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { getPaymentDataFromOffer } from "../../components/matches/utils/getPaymentDataFromOffer";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useSellOfferDetail } from "../../hooks/query/peach069/useSellOffer";
import { useSellOfferTradeRequestsReceived } from "../../hooks/query/peach069/useSellOfferTradeRequests";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

const rejectTradeRequest = async (
  navigation: any,
  sellOfferId: string,
  userId: string,
): Promise<void> => {
  await peachAPI.private.peach069.rejectSellOfferTradeRequestReceivedByIds({
    sellOfferId,
    userId,
  });

  navigation.navigate("homeScreen", {
    screen: "home",
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

  if (result) {
    // navigation.navigate("contract", { contractId: result.id });
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

export function BrowseTradeRequestsToMySellOffer() {
  const navigation = useStackNavigation();

  const { user: selfUser } = useSelfUser();

  const { offerId } = useRoute<"browseTradeRequestsToMySellOffer">().params;
  const title = "Peach69 Sell Offer " + offerId;

  const { sellOffer, isLoading } = useSellOfferDetail(offerId);
  const { sellOfferTradeRequests, isLoading: isLoadingTradeRequests } =
    useSellOfferTradeRequestsReceived(offerId);

  return (
    <Screen header={<Header title={title} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <PeachText>0.69 Peach Sell Offer </PeachText>
        <PeachText>Offer ID: {offerId}</PeachText>
        {!isLoading && (
          <>
            <PeachText>Amount: {sellOffer?.amount}</PeachText>
            <PeachText>
              Means of Payment: {JSON.stringify(sellOffer?.meansOfPayment)}
            </PeachText>
          </>
        )}
        <>
          {!isLoadingTradeRequests &&
            !!sellOfferTradeRequests &&
            !!sellOffer &&
            !!selfUser &&
            sellOfferTradeRequests.map((item, index) => {
              return (
                <>
                  <PeachText>-------</PeachText>
                  <PeachText>TR ID: {item.id}</PeachText>
                  <PeachText>TR User: {item.userId}</PeachText>
                  <PeachText>TR Price: {item.price}</PeachText>
                  <PeachText>TR Currency: {item.currency}</PeachText>
                  <PeachText>TR PM: {item.paymentMethod}</PeachText>
                  <View style={tw`flex-row gap-10px`}>
                    <Button
                      style={[tw`bg-success-main`]}
                      onPress={() =>
                        acceptTradeRequest(
                          sellOffer,
                          item,
                          selfUser,
                          navigation,
                        )
                      }
                    >
                      accept
                    </Button>
                    <Button
                      style={[tw`bg-error-main`]}
                      onPress={() =>
                        rejectTradeRequest(
                          navigation,
                          item.sellOfferId,
                          item.userId,
                        )
                      }
                    >
                      reject
                    </Button>
                    <Button
                      style={[tw`bg-error-main`]}
                      onPress={() =>
                        goToChat(navigation, item.sellOfferId, item.userId)
                      }
                    >
                      chat
                    </Button>
                  </View>
                  <PeachText>-------</PeachText>
                </>
              );
            })}
        </>
      </PeachScrollView>
    </Screen>
  );
}
