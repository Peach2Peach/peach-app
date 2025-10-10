import { Screen } from "../../components/Screen";
import { useCanInstantTradeWithSellOffer } from "../../hooks/query/peach069/useCanInstantTradeWithSellOffer";
import { useSellOfferDetail } from "../../hooks/query/peach069/useSellOffer";
import { useSellOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useSellOfferTradeRequestBySelfUser";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getRandom } from "../../utils/crypto/getRandom";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { LoadingScreen } from "../loading/LoadingScreen";

import { ExpressFlowTradeRequestToOffer } from "./ExpressFlowTradeRequestToOffer";

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

const removeTradeRequestFunction = async ({
  sellOfferId,
  sellOfferTradeRequestPerformedBySelfUserRefetch,
}: {
  sellOfferId: string;
  sellOfferTradeRequestPerformedBySelfUserRefetch: Function;
}): Promise<void> => {
  await peachAPI.private.peach069.removePerformedSellOfferTradeRequest({
    sellOfferId,
  });

  sellOfferTradeRequestPerformedBySelfUserRefetch();
};

const SYMMETRIC_KEY_BYTES = 32;
const performTradeRequestFunction = async ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  sellOfferId,
  selfUser,
  offerOwnerUser,
  sellOfferTradeRequestPerformedBySelfUserRefetch,
  handleError,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  sellOfferId: string;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
  sellOfferTradeRequestPerformedBySelfUserRefetch: Function;
  handleError: Function;
}): Promise<boolean> => {
  if (!peachWallet) throw Error("Peach Wallet not ready");
  if (
    !selectedPaymentData ||
    !selectedCurrency ||
    !peachWallet ||
    !selfUser ||
    !offerOwnerUser
  )
    throw Error("values not ready");
  const { address: releaseAddress, index } = await peachWallet.getAddress();

  const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

  const releaseAddressMessageSignature = peachWallet.signMessage(
    message,
    index,
  );

  const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString("hex");
  const { encrypted, signature } = await signAndEncrypt(
    symmetricKey,
    [
      ...selfUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
      ...offerOwnerUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
    ].join("\n"),
  );

  const decryptionResult = await decryptSymmetricKey(encrypted, signature, [
    ...selfUser.pgpPublicKeys,
    ...offerOwnerUser.pgpPublicKeys,
  ]);
  if (!decryptionResult)
    throw Error("Couldnt decrypt the created symmetric key");
  const encryptedPaymentData = await encryptPaymentData(
    cleanPaymentData(selectedPaymentData),
    symmetricKey,
  );
  if (!encryptedPaymentData) throw Error("PAYMENTDATA_ENCRYPTION_FAILED");
  const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

  const { error } =
    await peachAPI.private.peach069.performSellOfferTradeRequest({
      sellOfferId,
      paymentMethod: selectedPaymentData.type,
      currency: selectedCurrency,
      paymentDataHashed: hashedPaymentData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      maxMiningFeeRate: maxMiningFeeRate,
      releaseAddress,
      releaseAddressMessageSignature,
    });
  if (error) {
    handleError(error);
    return false;
  } else {
    sellOfferTradeRequestPerformedBySelfUserRefetch();
    return true;
  }
};

const performInstantTrade = async ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  sellOfferId,
  selfUser,
  offerOwnerUser,
  navigation,
  handleError,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  sellOfferId: string;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
  navigation: StackNavigation;
  handleError: Function;
}): Promise<void> => {
  if (!peachWallet) throw Error("Peach Wallet not ready");
  if (!selectedPaymentData || !selectedCurrency || !selfUser || !offerOwnerUser)
    throw Error("values not ready");
  const { address: releaseAddress, index } = await peachWallet.getAddress();

  const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

  const releaseAddressMessageSignature = peachWallet.signMessage(
    message,
    index,
  );

  const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString("hex");
  const { encrypted, signature } = await signAndEncrypt(
    symmetricKey,
    [
      ...selfUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
      ...offerOwnerUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
    ].join("\n"),
  );

  const decryptionResult = await decryptSymmetricKey(encrypted, signature, [
    ...selfUser.pgpPublicKeys,
    ...offerOwnerUser.pgpPublicKeys,
  ]);
  if (!decryptionResult)
    throw Error("Couldnt decrypt the created symmetric key");
  const encryptedPaymentData = await encryptPaymentData(
    cleanPaymentData(selectedPaymentData),
    symmetricKey,
  );
  if (!encryptedPaymentData) throw Error("PAYMENTDATA_ENCRYPTION_FAILED");
  const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

  const instantTradeResp =
    await peachAPI.private.peach069.performInstantTradeWithSellOfferById({
      sellOfferId,
      paymentMethod: selectedPaymentData.type,
      currency: selectedCurrency,
      paymentDataHashed: hashedPaymentData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      maxMiningFeeRate: maxMiningFeeRate,
      releaseAddress,
      releaseAddressMessageSignature,
    });

  if (instantTradeResp.error) handleError(instantTradeResp.error);
  else {
    if (instantTradeResp.result?.id) {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: "homeScreen",
            params: { screen: "yourTrades", params: { tab: "yourTrades.buy" } },
          },
          {
            name: "contract",
            params: {
              contractId: instantTradeResp.result?.id,
            },
          },
        ],
      });
    }
  }
};

export function ExpressBuyTradeRequestToSellOffer() {
  const { offerId } = useRoute<"expressBuyTradeRequest">().params;

  const {
    sellOffer,
    isLoading,
    error,
    refetch: refetchSellOffer,
  } = useSellOfferDetail(offerId, false, false);
  const navigation = useStackNavigation();

  const onTradeRequestDisappearing = async () => {
    const response =
      await peachAPI.private.peach069.hasSellOfferTurnedToMyContract({
        sellOfferId: offerId,
      });

    if (response.result && response.result.success) {
      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "yourTrades" } },
          {
            name: "contract",
            params: {
              contractId: response.result.contract?.id,
            },
          },
        ],
      });
      return;
    }

    refetchSellOffer();
  };

  //TODO: make this work by deactivating the refresh of the useSellOfferDetail
  if (error) {
    navigation.reset({
      index: 0,
      routes: [{ name: "homeScreen", params: { screen: "home" } }],
    });
  }

  const performThisTradeRequest = async ({
    maxMiningFeeRate,
    selectedPaymentData,
    selectedCurrency,
    handleError,
  }: {
    maxMiningFeeRate?: number;
    selectedPaymentData: PaymentData;
    selectedCurrency: Currency;
    handleError: Function;
  }) => {
    return await performTradeRequestFunction({
      sellOfferId: offerId,
      maxMiningFeeRate: maxMiningFeeRate,
      selectedPaymentData: selectedPaymentData,
      selectedCurrency: selectedCurrency,
      selfUser: selfUser,
      offerOwnerUser: offerOwnerUser,
      sellOfferTradeRequestPerformedBySelfUserRefetch:
        sellOfferTradeRequestPerformedBySelfUserRefetch,
      handleError,
    });
  };

  const performThisTradeRequestInstantTrade = async ({
    maxMiningFeeRate,
    selectedPaymentData,
    selectedCurrency,
    handleError,
  }: {
    maxMiningFeeRate?: number;
    selectedPaymentData: PaymentData;
    selectedCurrency: Currency;
    handleError: Function;
  }) => {
    await performInstantTrade({
      selectedPaymentData,
      maxMiningFeeRate: maxMiningFeeRate,
      selectedCurrency,
      sellOfferId: offerId,
      selfUser,
      offerOwnerUser,
      navigation,
      handleError,
    });
  };

  const goToThisChat = async () => {
    goToChat(navigation, offerId, selfUser!.id);
  };

  const removeThisTradeRequest = async () => {
    await removeTradeRequestFunction({
      sellOfferId: offerId,
      sellOfferTradeRequestPerformedBySelfUserRefetch:
        sellOfferTradeRequestPerformedBySelfUserRefetch,
    });
  };

  const { user: selfUser } = useSelfUser();
  const offerOwnerUser = sellOffer?.user;

  const {
    data: sellOfferTradeRequestPerformedBySelfUser,
    refetch: sellOfferTradeRequestPerformedBySelfUserRefetch,
  } = useSellOfferTradeRequestBySelfUser({ sellOfferId: offerId });

  const { data: canInstantTradeWithSellOffer } =
    useCanInstantTradeWithSellOffer(offerId);

  const originRoute = "expressBuyTradeRequest";

  if (
    isLoading ||
    !sellOffer ||
    canInstantTradeWithSellOffer === undefined ||
    sellOfferTradeRequestPerformedBySelfUser === undefined ||
    selfUser === undefined ||
    offerOwnerUser === undefined
  )
    return <LoadingScreen />;
  return (
    <Screen showTradingLimit header={offerIdToHex(sellOffer.id)}>
      <ExpressFlowTradeRequestToOffer
        offer={sellOffer}
        onTradeRequestDisappearingFunction={onTradeRequestDisappearing}
        originRoute={originRoute}
        canInstantTradeWithOffer={canInstantTradeWithSellOffer}
        offerTradeRequestPerformedBySelfUser={
          sellOfferTradeRequestPerformedBySelfUser
        }
        removeThisTradeRequestFunction={removeThisTradeRequest}
        performThisTradeRequestFunction={performThisTradeRequest}
        performThisTradeRequestInstantTradeFunction={
          performThisTradeRequestInstantTrade
        }
        goToChatFunction={goToThisChat}
        selfUser={selfUser}
        offerOwnerUser={offerOwnerUser}
      />
    </Screen>
  );
}
