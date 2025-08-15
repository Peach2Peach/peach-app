import { useQueryClient } from "@tanstack/react-query";
import { networks } from "bitcoinjs-lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
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
import { useFundingStatus } from "../../hooks/query/useFundingStatus";
import { offerKeys, useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import i18n, { languageState } from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { parseError } from "../../utils/parseError";
import { generateBlock } from "../../utils/regtest/generateBlock";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { useWalletState } from "../../utils/wallet/walletStore";
import { getLocalizedLink } from "../../utils/web/getLocalizedLink";
import { openURL } from "../../utils/web/openURL";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";
import { TransactionInMempool } from "./components/TransactionInMempool";
import { useCreateEscrow } from "./hooks/useCreateEscrow";
import { useFundFromPeachWallet } from "./hooks/useFundFromPeachWallet";
import { useHandleFundingStatus } from "./hooks/useHandleFundingStatus";

export const FundEscrow = () => {
  const { offerId } = useRoute<"fundEscrow">().params;
  const showErrorBanner = useShowErrorBanner();

  useSyncWallet({ enabled: true });
  const { offer, isLoading: offerIsLoading } = useOfferDetail(offerId);
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined;
  const canFetchFundingStatus =
    !!sellOffer &&
    !!sellOffer.escrow &&
    !sellOffer.refunded &&
    !sellOffer.released &&
    sellOffer.funding.status !== "FUNDED";
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
    isPending: fundingStatusIsPending,
  } = useFundingStatus(offerId, canFetchFundingStatus);

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  });

  useEffect(() => {
    if (!fundingStatusError) return;
    showErrorBanner(parseError(fundingStatusError));
  }, [fundingStatusError, showErrorBanner]);

  if (offerIsLoading || (canFetchFundingStatus && fundingStatusIsPending)) {
    return <BitcoinLoading text={i18n("sell.escrow.loading")} />;
  }
  if (!sellOffer?.escrow) return <CreateEscrowScreen offerIds={[offerId]} />;

  if (!fundingStatus || !sellOffer.escrow || !sellOffer.amount)
    return <BitcoinLoading text={i18n("sell.escrow.loading")} />;

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
              {i18n("sell.escrow.sendSats")}
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
        />
      </PeachScrollView>

      <View style={[tw`items-center justify-center gap-4 py-4`]}>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          <PeachText style={tw`text-primary-main button-medium`}>
            {i18n("sell.escrow.checkingFundingStatus")}
          </PeachText>
          <Loading size="small" color={tw.color("primary-main")} />
        </View>
        <HorizontalLine />
        <FundFromPeachWalletButton
          address={sellOffer.escrow}
          amount={sellOffer.amount}
          fundingStatus={fundingStatus}
        />
      </View>
    </Screen>
  );
};

function CreateEscrowScreen({ offerIds }: { offerIds: string[] }) {
  const { mutate, isPending } = useCreateEscrow();
  const queryClient = useQueryClient();

  const createEscrow = () => {
    mutate(offerIds, {
      onSuccess: () =>
        Promise.all(
          offerIds.map((id) =>
            queryClient.invalidateQueries({
              queryKey: offerKeys.detail(id),
            }),
          ),
        ),
    });
  };
  return (
    <Screen style={tw`items-center justify-center flex-1`}>
      <Button onPress={createEscrow} loading={isPending}>
        {i18n("sell.escrow.createEscrow")}
      </Button>
    </Screen>
  );
}

function FundEscrowHeader() {
  const { offerId } = useRoute<"fundEscrow">().params;
  const setPopup = useSetPopup();
  const showHelp = useCallback(() => setPopup(<EscrowPopup />), [setPopup]);
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );
  const multiOfferList = useOfferPreferences((state) => state.multiOfferList);
  const multiOffers = multiOfferList.find((list) => list.includes(offerId));

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [
      {
        ...headerIcons.cancel,
        onPress: cancelOffer,
      },
      { ...headerIcons.help, onPress: showHelp },
    ];
    if (getNetwork() === networks.regtest) {
      return [
        { ...headerIcons.generateBlock, onPress: generateBlock },
        ...icons,
      ];
    }
    return icons;
  }, [cancelOffer, showHelp]);

  const title = multiOffers
    ? `${i18n("sell.escrow.title")} ${offerIdToHex(offerId)}`
    : i18n("sell.escrow.title");

  return <Header title={title} icons={memoizedHeaderIcons} />;
}

const goToEscrowInfo = () =>
  openURL(getLocalizedLink("terms-and-conditions", languageState.locale));

function EscrowPopup() {
  return (
    <InfoPopup
      title={i18n("help.escrow.title")}
      content={
        <View style={tw`gap-4`}>
          <ParsedPeachText
            style={tw`text-black-100`}
            parse={[
              {
                pattern: new RegExp(i18n("help.escrow.description.link"), "u"),
                style: tw`underline`,
                onPress: goToEscrowInfo,
              },
            ]}
          >
            {i18n("help.escrow.description")}
          </ParsedPeachText>
          <InfoText>{i18n("help.escrow.description.proTip")}</InfoText>
          <InfoText>{i18n("help.escrow.description.proTip.2")}</InfoText>
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

type Props = {
  address: string;
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

  const onButtonPress = () => {
    setIsFunding(true);
    fundFromPeachWallet({
      offerId,
      amount: props.amount,
      fundingStatus: props.fundingStatus.status,
      address: props.address,
    }).then(() => setIsFunding(false));
  };

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={i18n("fundFromPeachWallet.funded")}
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
          {i18n("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
