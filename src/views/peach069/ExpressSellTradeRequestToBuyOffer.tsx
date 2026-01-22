import { Screen } from "../../components/Screen";
import { useBuyOfferDetail } from "../../hooks/query/peach069/useBuyOffer";
import { useBuyOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useBuyOfferTradeRequestBySelfUser";
import { useCanInstantTradeWithBuyOffer } from "../../hooks/query/peach069/useCanInstantTradeWithBuyOffer";
import { useUserDetails } from "../../hooks/query/peach069/useUser";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { getRandom } from "../../utils/crypto/getRandom";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { getPublicKeyForEscrow } from "../../utils/wallet/getPublicKeyForEscrow";
import { getWallet } from "../../utils/wallet/getWallet";
import { peachWallet } from "../../utils/wallet/setWallet";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ExpressFlowTradeRequestToOffer } from "./ExpressFlowTradeRequestToOffer";

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

const removeTradeRequestFunction = async ({
  buyOfferId,
  buyOfferTradeRequestPerformedBySelfUserRefetch,
}: {
  buyOfferId: number;
  buyOfferTradeRequestPerformedBySelfUserRefetch: Function;
}): Promise<void> => {
  await peachAPI.private.peach069.removePerformedBuyOfferTradeRequest({
    buyOfferId,
  });

  buyOfferTradeRequestPerformedBySelfUserRefetch();
};

const SYMMETRIC_KEY_BYTES = 32;
const performTradeRequestFunction = async ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  buyOfferId,
  selfUser,
  offerOwnerUser,
  buyOfferTradeRequestPerformedBySelfUserRefetch,
  handleError,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  buyOfferId: number;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
  buyOfferTradeRequestPerformedBySelfUserRefetch: Function;
  handleError: Function;
}): Promise<boolean> => {
  // if (!peachWallet) throw Error("Peach Wallet not ready");
  if (
    !selectedPaymentData ||
    !selectedCurrency ||
    // !peachWallet ||
    !selfUser ||
    !offerOwnerUser
  )
    throw Error("values not ready");
  // const { address: returnAddress } = await peachWallet.getAddress();

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

  const { error } = await peachAPI.private.peach069.performBuyOfferTradeRequest(
    {
      buyOfferId,
      paymentMethod: selectedPaymentData.type,
      currency: selectedCurrency,
      paymentDataHashed: hashedPaymentData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      maxMiningFeeRate: maxMiningFeeRate,
      // returnAddress,
    },
  );

  if (error) {
    handleError(error);
    return false;
  } else {
    buyOfferTradeRequestPerformedBySelfUserRefetch();
    return true;
  }
};

const createEscrowFn = async (offerId: string) => {
  // this function is not being called now
  const publicKey = getPublicKeyForEscrow(getWallet(), offerId);

  if (!peachWallet) {
    throw Error("Peach Wallet not Ready");
  }

  const { address: returnAddress } =
    await peachWallet?.getLastUnusedAddressInternal();

  const { result, error: err } = await peachAPI.private.offer.createEscrow({
    offerId,
    publicKey,
    returnAddress,
  });

  if (err) throw new Error(err.error);
  return result;
};

const performInstantTrade = async ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  buyOfferId,
  selfUser,
  offerOwnerUser,
  navigation,
  handleError,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  buyOfferId: number;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
  navigation: StackNavigation;
  handleError: Function;
}): Promise<void> => {
  {
    // if (!peachWallet) throw Error("Peach Wallet not ready");
    if (
      !selectedPaymentData ||
      !selectedCurrency ||
      // !peachWallet ||
      !selfUser ||
      !offerOwnerUser
    )
      throw Error("values not ready");
    // const { address: returnAddress, index } = await peachWallet.getAddress();

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
      await peachAPI.private.peach069.performInstantTradeWithBuyOfferById({
        buyOfferId: String(buyOfferId),
        paymentMethod: selectedPaymentData.type,
        currency: selectedCurrency,
        paymentDataHashed: hashedPaymentData,
        paymentDataEncrypted: encryptedPaymentData.encrypted,
        paymentDataSignature: encryptedPaymentData.signature,
        symmetricKeyEncrypted: encrypted,
        symmetricKeySignature: signature,
        maxMiningFeeRate: maxMiningFeeRate,
        // returnAddress,
      });

    if (instantTradeResp.error) {
      handleError(instantTradeResp.error);
    } else {
      if (instantTradeResp.result?.id) {
        // await createEscrowFn(instantTradeResp.result.id.split("-")[0]);
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
  }
};

export function ExpressSellTradeRequestToBuyOffer() {
  const { offerId } = useRoute<"expressSellTradeRequest">().params;

  const {
    buyOffer,
    isLoading,
    error,
    refetch: refetchBuyOffer,
  } = useBuyOfferDetail(offerId, false, false);

  const navigation = useStackNavigation();

  const onTradeRequestDisappearing = async () => {
    const response =
      await peachAPI.private.peach069.hasBuyOfferTurnedToMyContract({
        buyOfferId: offerId,
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

    refetchBuyOffer();
  };

  //TODO: make this work by deactivating the refresh of the useBuyOfferDetail
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
      buyOfferId: Number(offerId),
      maxMiningFeeRate: maxMiningFeeRate,
      selectedPaymentData: selectedPaymentData,
      selectedCurrency: selectedCurrency,
      selfUser: selfUser,
      offerOwnerUser: offerOwnerUser,
      buyOfferTradeRequestPerformedBySelfUserRefetch:
        buyOfferTradeRequestPerformedBySelfUserRefetch,
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
      buyOfferId: Number(offerId),
      selfUser,
      offerOwnerUser,
      navigation,
      handleError,
    });
  };

  const goToThisChat = async () => {
    goToChat(navigation, Number(offerId), selfUser!.id);
  };

  const removeThisTradeRequest = async () => {
    await removeTradeRequestFunction({
      buyOfferId: Number(offerId),
      buyOfferTradeRequestPerformedBySelfUserRefetch:
        buyOfferTradeRequestPerformedBySelfUserRefetch,
    });
  };

  const { user: selfUser } = useSelfUser();
  const { data: offerOwnerUser } = useUserDetails({
    userId: buyOffer !== undefined ? buyOffer.userId : "",
  });

  const {
    data: buyOfferTradeRequestPerformedBySelfUser,
    refetch: buyOfferTradeRequestPerformedBySelfUserRefetch,
  } = useBuyOfferTradeRequestBySelfUser({ buyOfferId: offerId });

  const { data: canInstantTradeWithBuyOffer } =
    useCanInstantTradeWithBuyOffer(offerId);

  const originRoute = "expressSellTradeRequest";

  if (
    isLoading ||
    !buyOffer ||
    canInstantTradeWithBuyOffer === undefined ||
    buyOfferTradeRequestPerformedBySelfUser === undefined ||
    selfUser === undefined ||
    offerOwnerUser === undefined
  )
    return <LoadingScreen />;
  return (
    <Screen showTradingLimit header={offerIdToHex(String(buyOffer.id))}>
      <ExpressFlowTradeRequestToOffer
        offer={buyOffer}
        onTradeRequestDisappearingFunction={onTradeRequestDisappearing}
        originRoute={originRoute}
        canInstantTradeWithOffer={canInstantTradeWithBuyOffer}
        offerTradeRequestPerformedBySelfUser={
          buyOfferTradeRequestPerformedBySelfUser
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
