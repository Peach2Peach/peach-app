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
import { Button } from "../../components/buttons/Button";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getRandom } from "../../utils/crypto/getRandom";
import { round } from "../../utils/math/round";
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
import { useOffer } from "./useOffer";

export function SellOfferDetails() {
  const { offerId } = useRoute<"sellOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  if (typeof offer?.amount === "object") {
    return null;
  }

  return (
    <Screen header={<Header title={`offer ${offerIdToHex(offerId)}`} />}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <SellOfferDetailsComponent offer={offer} />
      )}
    </Screen>
  );
}

function SellOfferDetailsComponent({ offer }: { offer: GetOfferResponseBody }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR");
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
  const isMatched = false;
  return (
    <>
      <PeachScrollView contentStyle={tw`gap-8 grow`}>
        <FundingInfo
          escrow={offer.escrow!}
          fundingStatus={offer.fundingStatus!}
        />
        <View style={tw`grow`}>
          <View style={tw`overflow-hidden rounded-2xl`}>
            {isMatched && <PeachyBackground />}
            <View style={tw`gap-8 m-1 rounded-2xl bg-primary-background-light`}>
              <UserCard user={offer.user} />
              {/** @ts-ignore */}
              <MiningFeeWarning amount={offer.amount} />
              <SellPriceInfo
                offer={offer}
                selectedCurrency={selectedCurrency}
              />
              {isMatched && selectedPaymentData ? (
                <PaidVia paymentMethod={selectedPaymentData.type} />
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
                    <Button style={tw`bg-error-main`}>Unmatch</Button>
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
      </PeachScrollView>

      <RequestTradeButton
        selectedCurrency={selectedCurrency}
        selectedPaymentData={selectedPaymentData}
        offerId={offer.id}
        counterparty={offer.user}
      />
    </>
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
      bitcoinPrice={bitcoinPrice}
    />
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
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];

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
      style={tw`self-center`}
      disabled={selectedPaymentData === undefined}
      onPress={() => mutate()}
    >
      request trade
    </Button>
  );
}
