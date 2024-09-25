import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { NewBubble } from "../../components/bubble/Bubble";
import { Button } from "../../components/buttons/Button";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getRandom } from "../../utils/crypto/getRandom";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { PriceInfo } from "./BuyerPriceInfo";
import { UserCard } from "./UserCard";
import { useOffer } from "./useOffer";

export function BuyOfferDetails() {
  const { offerId } = useRoute<"buyOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={<Header title={`offer ${offerIdToHex(offerId)}`} />}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <BuyOfferDetailsComponent offer={offer} />
      )}
    </Screen>
  );
}

function BuyOfferDetailsComponent({ offer }: { offer: GetOfferResponseBody }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR"); // TODO: get the first currency from the list
  const allPaymentMethods = getPaymentMethods(offer.meansOfPayment);
  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const paymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);
  const isMatched = true;
  return (
    <View style={tw`items-center justify-between gap-8 grow`}>
      <PeachScrollView>
        <View style={tw`gap-8 grow`}>
          <View style={tw`grow`}>
            <View style={tw`overflow-hidden rounded-2xl`}>
              {isMatched && <PeachyBackground />}
              <View
                style={tw`gap-8 m-1 bg-primary-background-light rounded-2xl`}
              >
                <UserCard user={offer.user} isBuyer />

                <BuyPriceInfo selectedCurrency={selectedCurrency} />
                {isMatched ? (
                  <View
                    style={tw`flex-row items-center self-stretch justify-between px-3`}
                  >
                    <PeachText>paid via</PeachText>
                    <NewBubble color="black" ghost>
                      {selectedPaymentData?.type}
                    </NewBubble>
                  </View>
                ) : (
                  <PaymentMethodSelector
                    meansOfPayment={offer.meansOfPayment}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                    selectedPaymentData={selectedPaymentData}
                    setSelectedPaymentData={setSelectedPaymentData}
                  />
                )}
                {isMatched && (
                  <>
                    <View style={tw`items-center justify-center z-99`}>
                      <Button
                        iconId="minusCircle"
                        textColor={tw.color("error-main")}
                        style={tw`bg-primary-background-light`}
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
          </View>
        </View>
      </PeachScrollView>
      {!isMatched && (
        <RequestTradeButton
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          offerId={offer.id}
          counterparty={offer.user}
        />
      )}
    </View>
  );
}

function RequestTradeButton({
  selectedCurrency,
  selectedPaymentData,
  offerId,
  counterparty,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offerId: string;
  counterparty: PublicUser;
}) {
  const { user } = useSelfUser();
  const { amount, premium } = useRoute<"buyOfferDetails">().params;
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

  const { mutate } = useMutation({
    mutationFn: async () => {
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
        });
      if (error) throw new Error(error.error);
      return result;
    },
    onSuccess: (response) => {
      if (!response) return;
      // eslint-disable-next-line no-alert
      alert("SUCCESS!");
    },
    onError: (error) => {
      // eslint-disable-next-line no-alert
      alert(error.message);
    },
  });
  return (
    <Button
      disabled={selectedPaymentData === undefined}
      onPress={() => mutate()}
    >
      request trade
    </Button>
  );
}

function BuyPriceInfo({ selectedCurrency }: { selectedCurrency: Currency }) {
  const { amount, premium } = useRoute<"buyOfferDetails">().params;
  const { data: priceBook } = useMarketPrices();

  const amountInBTC = amount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;

  const displayPrice = bitcoinPrice * amountInBTC * (1 + premium / CENT);

  return (
    <PriceInfo
      satsAmount={amount}
      selectedCurrency={selectedCurrency}
      premium={premium}
      price={displayPrice}
      bitcoinPrice={bitcoinPrice}
    />
  );
}
