import { networks } from "bitcoinjs-lib";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Loading } from "../../components/animation/Loading";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { BitcoinAddress } from "../../components/bitcoin/BitcoinAddress";
import { Button } from "../../components/buttons/Button";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { SATSINBTC } from "../../constants";
import { useRoute } from "../../hooks/useRoute";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { CancelSellOffersPopup } from "../../popups/CancelSellOffersPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import { languageState } from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { generateBlock } from "../../utils/regtest/generateBlock";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { useWalletState } from "../../utils/wallet/walletStore";
import { getLocalizedLink } from "../../utils/web/getLocalizedLink";
import { openURL } from "../../utils/web/openURL";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TransactionInMempool } from "./components/TransactionInMempool";
import { useFundEscrowSetup } from "./hooks/useFundEscrowSetup";
import { useFundFromPeachWallet } from "./hooks/useFundFromPeachWallet";
import { useTranslate } from "@tolgee/react";

export const FundEscrow = () => {
  const {
    offerId,
    fundingAddress,
    fundingAddresses,
    fundingStatus,
    fundingAmount,
  } = useFundEscrowSetup();
  const { t } = useTranslate("sell");
  if (!fundingAddress)
    return <BitcoinLoading text={t("sell.escrow.loading")} />;

  if (fundingStatus.status === "MEMPOOL")
    return (
      <TransactionInMempool offerId={offerId} txId={fundingStatus.txIds[0]} />
    );

  return (
    <Screen header={<FundEscrowHeader />}>
      <PeachScrollView contentStyle={tw`items-center gap-4`}>
        <View style={tw`items-center self-stretch justify-center`}>
          <View style={tw`flex-row items-center justify-center gap-1`}>
            <PeachText style={tw`settings`}>
              {t("sell.escrow.sendSats")}
            </PeachText>
            <BTCAmount
              style={tw`-mt-0.5`}
              amount={fundingAmount}
              size="medium"
            />
            <CopyAble value={fundingAddress} textPosition="bottom" />
          </View>
          <PeachText style={tw`subtitle-1`}>{offerIdToHex(offerId)}</PeachText>
        </View>

        <BitcoinAddress
          address={fundingAddress}
          amount={fundingAmount / SATSINBTC}
          label={`${t("settings.escrow.paymentRequest.label", { ns: "settings" })} ${offerIdToHex(offerId)}`}
        />
      </PeachScrollView>

      <View style={[tw`items-center justify-center gap-4 py-4`]}>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          <PeachText style={tw`text-primary-main button-medium`}>
            {t("sell.escrow.checkingFundingStatus")}
          </PeachText>
          <Loading style={tw`w-4 h-4`} color={tw.color("primary-main")} />
        </View>
        <HorizontalLine />
        <FundFromPeachWalletButton
          address={fundingAddress}
          addresses={fundingAddresses}
          amount={fundingAmount}
          fundingStatus={fundingStatus}
        />
      </View>
    </Screen>
  );
};

function FundEscrowHeader() {
  const { offerId } = useRoute<"fundEscrow">().params;
  const { t } = useTranslate("sell");
  const fundMultiple = useWalletState((state) =>
    state.getFundMultipleByOfferId(offerId),
  );
  const setPopup = useSetPopup();
  const showHelp = useCallback(() => setPopup(<EscrowPopup />), [setPopup]);
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );

  const cancelFundMultipleOffers = useCallback(
    () => setPopup(<CancelSellOffersPopup fundMultiple={fundMultiple} />),
    [fundMultiple, setPopup],
  );

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [
      {
        ...headerIcons.cancel,
        onPress: fundMultiple ? cancelFundMultipleOffers : cancelOffer,
      },
      { ...headerIcons.help, onPress: showHelp },
    ];
    if (getNetwork() === networks.regtest) {
      icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock });
    }
    return icons;
  }, [cancelFundMultipleOffers, cancelOffer, fundMultiple, showHelp]);

  return <Header title={t("sell.escrow.title")} icons={memoizedHeaderIcons} />;
}

const goToEscrowInfo = () =>
  openURL(getLocalizedLink("terms-and-conditions", languageState.locale));

function EscrowPopup() {
  const { t } = useTranslate("help");
  return (
    <InfoPopup
      title={t("help.escrow.title")}
      content={
        <View style={tw`gap-4`}>
          <ParsedPeachText
            parse={[
              {
                pattern: new RegExp(t("help.escrow.description.link"), "u"),
                style: tw`underline`,
                onPress: goToEscrowInfo,
              },
            ]}
          >
            {t("help.escrow.description")}
          </ParsedPeachText>
          <InfoText>{t("help.escrow.description.proTip")}</InfoText>
          <InfoText>{t("help.escrow.description.proTip.2")}</InfoText>
        </View>
      }
    />
  );
}

function InfoText({ children }: { children: string }) {
  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Icon id="info" size={32} color={tw.color("black-100")} />
      <PeachText style={tw`shrink`}>{children}</PeachText>
    </View>
  );
}

type Props = {
  address: string;
  addresses: string[];
  amount: number;
  fundingStatus: FundingStatus;
};

function FundFromPeachWalletButton(props: Props) {
  const { offerId } = useRoute<"fundEscrow">().params;
  const fundFromPeachWallet = useFundFromPeachWallet();
  const fundedFromPeachWallet = useWalletState((state) =>
    state.isFundedFromPeachWallet(props.address),
  );
  const [isFunding, setIsFunding] = useState(false);
  const { t } = useTranslate();

  const onButtonPress = () => {
    setIsFunding(true);
    fundFromPeachWallet({
      offerId,
      amount: props.amount,
      fundingStatus: props.fundingStatus.status,
      address: props.address,
      addresses: props.addresses,
    }).then(() => setIsFunding(false));
  };

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={t("fundFromPeachWallet.funded")}
          IconComponent={
            <Icon id="checkCircle" size={16} color={tw.color("success-main")} />
          }
        />
      ) : (
        <Button
          ghost
          textColor={tw.color("primary-main")}
          iconId="sell"
          onPress={onButtonPress}
          loading={isFunding}
        >
          {t("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
