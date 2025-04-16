import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getRandom } from "../../utils/crypto/getRandom";
import { round } from "../../utils/math/round";
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
import { PriceInfo } from "./BuyerPriceInfo";
import { FundingInfo } from "./FundingInfo";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";
import { canUserInstantTrade } from "./canUserInstantTrade";
import { useOffer } from "./useOffer";
import { useTradeRequest } from "./useTradeRequest";

export function SellOfferDetails() {
  const { offerId } = useRoute<"sellOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={`offer ${offerIdToHex(offerId)}`}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <SellOfferDetailsComponent offer={offer} />
      )}
    </Screen>
  );
}

function SellOfferDetailsComponent({ offer }: { offer: GetOfferResponseBody }) {
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
  const { requestingOfferId } = useRoute<"sellOfferDetails">().params;
  const { data } = useTradeRequest(offer.id, requestingOfferId);
  return (
    <View style={tw`items-center justify-between gap-8 grow`}>
      <PeachScrollView contentStyle={tw`gap-8 grow`}>
        <FundingInfo
          escrow={offer.escrow!}
          fundingStatus={offer.fundingStatus!}
        />
        <View style={tw`overflow-hidden rounded-2xl`}>
          {!!data?.tradeRequest && <PeachyBackground />}
          <View style={tw`gap-8 m-1 rounded-2xl bg-primary-background-light`}>
            <UserCard user={offer.user} />
            {/** @ts-ignore */}
            <MiningFeeWarning amount={offer.amount} />
            <SellPriceInfo offer={offer} selectedCurrency={selectedCurrency} />
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
                    style={tw`hidden bg-primary-background-light`}
                  >
                    UNDO
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
        <RequestTradeAction
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          offer={offer}
        />
      )}
    </View>
  );
}

function SellPriceInfo({
  offer,
  selectedCurrency,
}: {
  offer: GetOfferResponseBody;
  selectedCurrency: Currency;
}) {
  const { data: priceBook, isSuccess } = useMarketPrices();

  // @ts-ignore
  const amountInBTC = offer.amount / SATSINBTC;
  const displayPrice = offer.prices?.[selectedCurrency] ?? 0;

  const bitcoinPrice =
    priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice;
  const marketPrice = amountInBTC * bitcoinPrice;

  // @ts-ignore
  const premium = offer.matched
    ? isSuccess
      ? round((displayPrice / marketPrice - 1) * CENT, 2)
      : 0
    : offer.premium;

  return (
    <PriceInfo
      // @ts-ignore
      satsAmount={offer.amount}
      selectedCurrency={selectedCurrency}
      // @ts-ignore
      premium={premium}
      price={displayPrice}
    />
  );
}

function RequestTradeAction({
  selectedCurrency,
  selectedPaymentData,
  offer,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offer: GetOfferResponseBody;
}) {
  const { id: offerId, user: counterparty, amount } = offer;
  const { user } = useSelfUser();
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];
  const { requestingOfferId } = useRoute<"sellOfferDetails">().params;

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

  const showError = useShowErrorBanner();

  const getSignedAddress = async () => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (payoutToPeachWallet) {
      const { address, index } = await peachWallet.getAddress();
      const message = getMessageToSignForAddress(publicKey, address);
      return {
        address,
        message,
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
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    onMutate: async (_instantTrade: boolean) => {
      const tradeRequst = {
        amount,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData?.type,
        fiatPrice: offer.prices?.[selectedCurrency],
      };
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      const previousData = queryClient.getQueryData(
        offerKeys.tradeRequest(offerId),
      );
      queryClient.setQueryData(offerKeys.tradeRequest(offerId), tradeRequst);
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

      const { address, signature: messageSignature } = await getSignedAddress();

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithSellOffer({
          offerId,
          currency: selectedCurrency,
          paymentMethod: selectedPaymentData.type,
          paymentData: hashedPaymentData,
          symmetricKeyEncrypted: encrypted,
          symmetricKeySignature: signature,
          paymentDataEncrypted: encryptedPaymentData.encrypted,
          paymentDataSignature: encryptedPaymentData.signature,
          releaseAddress: address,
          messageSignature,
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
      if (response && "contractId" in response) {
        navigation.reset({
          index: 1,
          routes: [
            { name: "homeScreen", params: { screen: "yourTrades" } },
            { name: "contract", params: { contractId: response.contractId } },
          ],
        });
      }
    },
  });

  if (user === undefined) return null;

  const { instantTradeCriteria } = offer;
  const canInstantTrade =
    instantTradeCriteria && canUserInstantTrade(user, instantTradeCriteria);

  if (canInstantTrade) {
    return (
      <ConfirmSlider label1="instant trade" onConfirm={() => mutate(true)} />
    );
  }

  return (
    <Button
      style={tw`self-center`}
      disabled={selectedPaymentData === undefined}
      onPress={() => mutate(false)}
    >
      request trade
    </Button>
  );
}
