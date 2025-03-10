import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { GetMatchesResponseBody } from "../../../peach-api/src/@types/api/offerAPI";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { AppPopup } from "../../popups/AppPopup";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { error } from "../../utils/log/error";
import { isLimitReached } from "../../utils/match/isLimitReached";
import { saveOffer } from "../../utils/offer/saveOffer";
import { parseError } from "../../utils/parseError";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../../views/contract/helpers/decryptSymmetricKey";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";
import { Icon } from "../Icon";
import { ProfileInfo } from "../ProfileInfo";
import { NewBubble as Bubble } from "../bubble/Bubble";
import { useSetPopup } from "../popup/GlobalPopup";
import { PeachText } from "../text/PeachText";
import { HorizontalLine } from "../ui/HorizontalLine";
import { options } from "./buttons/options";
import { PriceInfo } from "./components/PriceInfo";
import { getPremiumOfMatchedOffer } from "./getPremiumOfMatchedOffer";
import { useCashPaymentMethodName } from "./useCashPaymentMethodName";
import { createRefundTx } from "./utils/createRefundTx";
import { getPaymentDataFromOffer } from "./utils/getPaymentDataFromOffer";
import { useHandleError } from "./utils/useHandleError";
import { useHandleMissingPaymentData } from "./utils/useHandleMissingPaymentData";

export const Match = ({
  match,
  offer,
  currentPage,
}: {
  match: Match;
  offer: SellOffer;
  currentPage: number;
}) => {
  const {
    selectedPaymentMethod,
    matched,
    user,
    unavailable,
    amount,
    matchedPrice,
    selectedCurrency,
  } = match;

  const tradingLimitReached = isLimitReached(
    unavailable.exceedsLimit || [],
    selectedPaymentMethod,
  );

  const currentOptionName = useMemo(
    () =>
      matched
        ? "offerMatched"
        : tradingLimitReached
          ? "tradingLimitReached"
          : !selectedPaymentMethod
            ? "missingSelection"
            : "acceptMatch",
    [matched, selectedPaymentMethod, tradingLimitReached],
  );

  const { isDarkMode } = useThemeStore();

  return (
    <View style={tw`justify-center flex-1`}>
      <View
        style={[
          tw`overflow-hidden border-4 rounded-2xl`,
          options[currentOptionName].backgroundColor,
          {
            borderColor:
              options[currentOptionName].backgroundColor.backgroundColor,
          },
        ]}
        onStartShouldSetResponder={() => true}
      >
        <View
          style={tw.style(
            "gap-4 p-4",
            isDarkMode ? "bg-card" : "bg-primary-background-light-color",
          )}
        >
          <ProfileInfo user={user} isOnMatchCard />

          <HorizontalLine />

          <SellerPriceInfo
            amount={amount}
            price={matchedPrice}
            currency={selectedCurrency}
          />

          <HorizontalLine />

          <View style={tw`gap-4`}>
            <PaymentDetail
              label={i18n("match.selectedCurrency")}
              value={selectedCurrency}
            />
            {selectedPaymentMethod && (
              <>
                {isCashTrade(selectedPaymentMethod) ? (
                  <CashPaymentDetail method={selectedPaymentMethod} />
                ) : (
                  <PaymentDetail
                    label={i18n("match.selectedPaymentMethod")}
                    value={i18n(`paymentMethod.${selectedPaymentMethod}`)}
                  />
                )}
              </>
            )}
          </View>
        </View>
        <MatchOfferButton
          offer={offer}
          match={match}
          optionName={currentOptionName}
          currentPage={currentPage}
        />
      </View>
    </View>
  );
};

function CashPaymentDetail({ method }: { method: `cash.${string}` }) {
  const value = useCashPaymentMethodName(method);

  return (
    <PaymentDetail label={i18n("match.selectedPaymentMethod")} value={value} />
  );
}

function PaymentDetail({ label, value }: { label: string; value?: string }) {
  return (
    <View style={tw`flex-row justify-between`}>
      <PeachText style={tw`text-black-50`}>{label}</PeachText>
      <Bubble disabled color="orange" ghost>
        {value}
      </Bubble>
    </View>
  );
}

type MatchButtonProps = {
  offer: SellOffer;
  match: Match;
  optionName: keyof typeof options;
  currentPage: number;
};
function MatchOfferButton({
  offer,
  match,
  optionName,
  currentPage,
}: MatchButtonProps) {
  const currentOption = options[optionName];
  const { mutate, isPending } = useAcceptMatch(offer, match, currentPage);

  const onPress = () => {
    if (optionName === "acceptMatch") {
      mutate();
    }
  };

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-center py-2 gap-10px`}
      onPress={onPress}
      disabled={optionName === "offerMatched" || isPending}
    >
      <PeachText style={tw`button-large text-primary-background-light-color`}>
        {i18n(currentOption.text)}
      </PeachText>
      <Icon
        id={currentOption.iconId}
        color={tw.color("primary-background-light-color")}
        size={24}
      />
    </TouchableOpacity>
  );
}

function useAcceptMatch(offer: SellOffer, match: Match, currentPage: number) {
  const { selectedCurrency, selectedPaymentMethod, offerId } = match;
  const queryClient = useQueryClient();
  const navigation = useStackNavigation();
  const handleError = useHandleError();
  const setPopup = useSetPopup();
  const handleMissingPaymentData = useHandleMissingPaymentData();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: matchesKeys.matchesForOffer(offer.id),
      });
      const previousData = queryClient.getQueryData<GetMatchesResponseBody>(
        matchesKeys.matchesForOffer(offer.id),
      );
      queryClient.setQueryData(
        matchesKeys.matchesForOffer(offer.id),
        (oldQueryData: InfiniteData<GetMatchesResponseBody> | undefined) =>
          updateMatchedStatus(oldQueryData, offerId, currentPage),
      );

      return { previousData };
    },
    mutationFn: async () => {
      if (!selectedCurrency || !selectedPaymentMethod)
        throw new Error("MISSING_VALUES");

      const { result: matchOfferData, error: dataError } =
        await generateMatchOfferData({
          match,
          offer,
          currency: selectedCurrency,
          paymentMethod: selectedPaymentMethod,
        });
      if (!matchOfferData) throw new Error(dataError || "UNKNOWN_ERROR");

      const { result, error: err } =
        await peachAPI.private.offer.matchOffer(matchOfferData);

      if (result) {
        return result;
      }
      if (err) handleError(err);
      throw new Error("OFFER_TAKEN");
    },
    onError: (err, _variables, context) => {
      const errorMsg = parseError(err);

      if (
        errorMsg === "MISSING_PAYMENTDATA" &&
        selectedCurrency &&
        selectedPaymentMethod
      ) {
        handleMissingPaymentData(
          offer,
          selectedCurrency,
          selectedPaymentMethod,
        );
      } else if (errorMsg === "OFFER_TAKEN") {
        setPopup(<AppPopup id="offerTaken" />);
      } else {
        if (errorMsg === "MISSING_VALUES")
          error(
            "Match data missing values.",
            `selectedCurrency: ${selectedCurrency}`,
            `selectedPaymentMethod: ${selectedPaymentMethod}`,
          );
        handleError({ error: errorMsg });
      }
      queryClient.setQueryData(
        matchesKeys.matchesForOffer(offer.id),
        context?.previousData,
      );
    },
    onSuccess: async (result) => {
      if ("refundTx" in result && result.refundTx) {
        const refundTx = await createRefundTx(offer, result.refundTx);
        saveOffer({
          ...offer,
          doubleMatched: true,
          contractId: result.contractId,
          refundTx,
        });
      }
      if ("contractId" in result && result.contractId) {
        navigation.replace("contract", { contractId: result.contractId });
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offer.id) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchesForOffer(offer.id),
        }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchDetail(offer.id, match.offerId),
        }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
      ]),
  });
}

type Params = {
  offer: SellOffer;
  match: Match;
  currency: Currency;
  paymentMethod: PaymentMethod;
};
async function generateMatchOfferData({
  offer,
  match,
  currency,
  paymentMethod,
}: Params) {
  if (!match.matchedPrice) return { error: "MISSING_MATCHED_PRICE" };

  const { paymentData, error: err } = getPaymentDataFromOffer(
    offer,
    paymentMethod,
  );
  if (!paymentData) return { error: err };

  const { symmetricKeyEncrypted, symmetricKeySignature, user } = match;

  const symmetricKey = await decryptSymmetricKey(
    symmetricKeyEncrypted,
    symmetricKeySignature,
    user.pgpPublicKeys,
  );
  if (!symmetricKey) return { error: "SYMMETRIC_KEY_DECRYPTION_FAILED" };

  const encryptedPaymentData = await encryptPaymentData(
    cleanPaymentData(paymentData),
    symmetricKey,
  );
  if (!encryptedPaymentData) return { error: "PAYMENTDATA_ENCRYPTION_FAILED" };

  return {
    result: {
      offerId: offer.id,
      matchingOfferId: match.offerId,
      price: match.matchedPrice,
      premium: match.premium,
      currency,
      paymentMethod,
      symmetricKeyEncrypted: undefined,
      symmetricKeySignature: undefined,
      instantTrade: match.instantTrade,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    },
  };
}

type PriceInfoProps = {
  amount: number;
  price: number | null;
  currency?: Currency;
};

function SellerPriceInfo({ amount, price, currency }: PriceInfoProps) {
  const { data: priceBook } = useMarketPrices();
  if (!price || !currency) return null;

  const premium = getPremiumOfMatchedOffer(
    { amount, price, currency },
    priceBook,
  );

  return (
    <PriceInfo
      amount={amount}
      price={price}
      currency={currency}
      premium={premium}
    />
  );
}

function updateMatchedStatus(
  oldQueryData: InfiniteData<GetMatchesResponseBody> | undefined,
  matchingOfferId: string,
  currentPage: number,
) {
  if (!oldQueryData) return oldQueryData;

  const matches = oldQueryData.pages[currentPage]?.matches || [];
  const newMatches = matches.map((m) => ({
    ...m,
    matched: m.offerId === matchingOfferId ? true : m.matched,
  }));

  return {
    ...oldQueryData,
    pages: oldQueryData.pages.map((page, i) =>
      i === currentPage ? { ...page, matches: newMatches } : page,
    ),
  };
}
