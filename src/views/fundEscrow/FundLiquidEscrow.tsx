import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { BitcoinAddress } from "../../components/bitcoin/BitcoinAddress";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { SATSINBTC } from "../../constants";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { PreferenceMethods } from "../offerPreferences/components/PreferenceMethods";

type Props = {
  offerId: string;
  sellOffer: SellOffer;
};

/**
 * Liquid variant of the escrow funding screen. Same shape as the mainchain
 * one, minus everything that is mainchain-only: there is no "fund from Peach
 * wallet" (the Peach wallet cannot hold L-BTC) and no multi-offer batching.
 */
export function FundLiquidEscrow({ offerId, sellOffer }: Props) {
  if (!sellOffer.escrow) return null;

  return (
    <Screen header={<FundLiquidEscrowHeader offerId={offerId} />}>
      <PeachScrollView contentStyle={tw`items-center gap-4`}>
        <View style={tw`items-center self-stretch justify-center`}>
          <PreferenceMethods
            meansOfPayment={sellOffer.meansOfPayment}
            paymentData={sellOffer.paymentData}
            type="sell"
            setCurrency={() => {}}
          />
          <View style={tw`flex-row items-center justify-center gap-1`}>
            <PeachText style={tw`settings`}>
              {i18n("sell.escrow.liquid.sendSats")}
            </PeachText>
            <BTCAmount
              style={tw`-mt-0.5`}
              amount={sellOffer.amount}
              size="medium"
            />
            <CopyAble value={String(sellOffer.amount)} textPosition="bottom" />
          </View>
          <View style={tw`flex-row items-center justify-center gap-1`}>
            <PeachText style={tw`subtitle-1`}>
              {offerIdToHex(offerId)}
            </PeachText>
            <CopyAble value={offerIdToHex(offerId)} textPosition="bottom" />
          </View>
        </View>

        <BitcoinAddress
          address={sellOffer.escrow}
          amount={sellOffer.amount / SATSINBTC}
          offerId={offerId}
          chain="liquid"
        />

        <PeachText style={tw`text-center text-black-65 body-s`}>
          {i18n("sell.escrow.liquid.unconfidential")}
        </PeachText>
      </PeachScrollView>

      <View style={[tw`items-center justify-center gap-4 py-4`]}>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          <PeachText style={tw`text-primary-main button-medium`}>
            {i18n("sell.escrow.checkingFundingStatus")}
          </PeachText>
          <Loading size="small" color={tw.color("primary-main")} />
        </View>
        <HorizontalLine />
      </View>
    </Screen>
  );
}

function FundLiquidEscrowHeader({ offerId }: { offerId: string }) {
  const setPopup = useSetPopup();
  const showHelp = useCallback(
    () => setPopup(<LiquidEscrowPopup />),
    [setPopup],
  );
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );

  const icons = useMemo(
    () => [
      { ...headerIcons.cancel, onPress: cancelOffer },
      { ...headerIcons.help, onPress: showHelp },
    ],
    [cancelOffer, showHelp],
  );

  return <Header title={i18n("sell.escrow.liquid.title")} icons={icons} />;
}

function LiquidEscrowPopup() {
  return (
    <InfoPopup
      title={i18n("help.escrow.liquid.title")}
      content={
        <View style={tw`gap-4`}>
          <InfoText>{i18n("help.escrow.liquid.description")}</InfoText>
          <InfoText>{i18n("help.escrow.liquid.description.2")}</InfoText>
          <InfoText>{i18n("help.escrow.liquid.description.3")}</InfoText>
        </View>
      }
    />
  );
}

function InfoText({ children }: { children: string }) {
  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Icon id="info" size={32} color={tw.color("black-100")} />
      <PeachText style={tw`shrink text-black-100`}>{children}</PeachText>
    </View>
  );
}
