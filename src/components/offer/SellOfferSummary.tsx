import type { ReactElement } from "react";
import { View } from "react-native";
import { SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { getOfferPrice } from "../../utils/offer/getOfferPrice";
import { priceFormat } from "../../utils/string/priceFormat";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { EscrowLink } from "../matches/components/EscrowLink";
import { getPremiumColor } from "../matches/utils/getPremiumColor";
import { PeachText } from "../text/PeachText";
import { HorizontalLine } from "../ui/HorizontalLine";
import { SummaryCard } from "./SummaryCard";

type Props = {
  offer: Pick<
    SellOffer | SellOfferDraft,
    | "amount"
    | "tradeStatus"
    | "premium"
    | "fixedPrice"
    | "fixedPriceCurrency"
    | "meansOfPayment"
    | "experienceLevelCriteria"
    | "instantTradeCriteria"
    | "paymentData"
  > & {
    escrow?: string;
    amountSats?: number;
  };
  numberOfOffers?: number;
  walletLabel: ReactElement;
  type?: "buy" | "sell";
  setDisplayedCurrency: Function;
};

const isSellOfferWithDefinedEscrow = (
  offer: Pick<
    SellOffer | SellOfferDraft,
    "amount" | "tradeStatus" | "premium" | "meansOfPayment"
  > & {
    escrow?: string;
  },
): offer is SellOffer & { escrow: string } =>
  "escrow" in offer && !!offer.escrow;

export const SellOrBuyOfferSummary = ({
  offer,
  numberOfOffers,
  walletLabel,
  setDisplayedCurrency,
  type = "sell",
}: Props) => {
  const {
    tradeStatus,
    amount,
    premium,
    fixedPrice,
    fixedPriceCurrency,
    meansOfPayment,
    amountSats,
    paymentData,
  } = offer;

  const hasFixedPrice = fixedPrice !== undefined;

  const { data: priceBook } = useMarketPrices();
  const marketPrice =
    hasFixedPrice && priceBook && amount > 0
      ? getOfferPrice({
          amount,
          premium: 0,
          prices: priceBook,
          currency: (fixedPriceCurrency ?? "EUR") as Currency,
        })
      : 0;
  const fixedPricePremium =
    marketPrice > 0 && fixedPrice !== undefined
      ? round((fixedPrice / marketPrice - 1) * 100, 2)
      : 0;
  const fixedPriceBtcRate =
    hasFixedPrice && fixedPrice !== undefined && amount > 0
      ? round((fixedPrice * SATSINBTC) / amount, 2)
      : 0;

  const premiumCurrency = (keys(meansOfPayment)[0] as Currency) ?? "EUR";
  const premiumPrice =
    !hasFixedPrice && priceBook && amount > 0
      ? getOfferPrice({
          amount,
          premium,
          prices: priceBook,
          currency: premiumCurrency,
        })
      : 0;

  const isInstantTrade = Boolean(
    "escrow" in offer
      ? offer.paymentData[keys(offer.paymentData)[0]]?.encrypted
      : Boolean(offer.instantTradeCriteria),
  );

  return (
    <SummaryCard>
      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-65`}>
          {i18n(
            type === "sell"
              ? `offer.summary.${tradeStatus !== "offerCanceled" ? "youAreSelling" : "youWereSelling"}`
              : "offer.summary.youAreBuying69",
          )}
        </PeachText>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          {!!numberOfOffers && (
            <PeachText style={tw`h6`}>{numberOfOffers} x</PeachText>
          )}
          <BTCAmount
            amount={type === "sell" ? amount : amountSats || 0}
            size="small"
          />
        </View>
      </SummaryCard.Section>

      <HorizontalLine />

      {hasFixedPrice ? (
        <SummaryCard.Section>
          <View style={tw`items-center`}>
            <PeachText style={tw`text-center text-black-65`}>
              {i18n("offer.summary.forAFixedPriceOf")}
            </PeachText>
            <PeachText style={tw`text-center subtitle-1`}>
              {fixedPrice} {fixedPriceCurrency}{" "}
              <PeachText style={tw`font-baloo`}>
                {`(${priceFormat(fixedPriceBtcRate)} BTC${fixedPriceCurrency})`}
              </PeachText>
            </PeachText>
            {marketPrice > 0 && (
              <PeachText style={tw`text-center text-black-65`}>
                {Math.abs(fixedPricePremium)}%{" "}
                <PeachText style={getPremiumColor(fixedPricePremium, false)}>
                  {i18n(
                    fixedPricePremium >= 0
                      ? "offer.summary.above"
                      : "offer.summary.below",
                  )}
                </PeachText>{" "}
                {i18n("offer.summary.marketPrice")}
              </PeachText>
            )}
          </View>
        </SummaryCard.Section>
      ) : (
        <SummaryCard.Section>
          <PeachText style={tw`text-center text-black-65`}>
            {i18n("offer.summary.withA")}
          </PeachText>
          <PeachText
            style={[
              tw`text-center subtitle-1`,
              getPremiumColor(offer.premium, false),
            ]}
          >
            <PeachText style={tw`subtitle-1`}>{Math.abs(premium)}% </PeachText>
            {i18n(
              premium >= 0 ? "offer.summary.premium" : "offer.summary.discount",
            )}
          </PeachText>
          {premiumPrice > 0 && (
            <PeachText style={tw`text-center text-black-65`}>
              {i18n(
                "sell.premium.currently",
                `${priceFormat(premiumPrice)} ${premiumCurrency}`,
              )}
            </PeachText>
          )}
        </SummaryCard.Section>
      )}

      <HorizontalLine />

      <SummaryCard.PaymentMethods
        meansOfPayment={meansOfPayment}
        setDisplayedCurrency={setDisplayedCurrency}
        offerPaymentData={paymentData}
      />

      <HorizontalLine />

      <SummaryCard.ExperienceLevelAndInstantTrade
        experienceLevelCriteria={offer.experienceLevelCriteria}
        isInstantTrade={isInstantTrade}
      />

      <HorizontalLine />

      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-65`}>
          {type === "sell"
            ? i18n("offer.summary.refundWallet")
            : i18n("offer.summary.releaseWallet")}
        </PeachText>
        {walletLabel}
      </SummaryCard.Section>

      {isSellOfferWithDefinedEscrow(offer) && (
        <>
          <HorizontalLine />

          <SummaryCard.Section>
            <EscrowLink address={offer.escrow} />
          </SummaryCard.Section>
        </>
      )}
    </SummaryCard>
  );
};
