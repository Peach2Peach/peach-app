import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { useSetGlobalOverlay } from "../../Overlay";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { BitcoinAddress } from "../../components/bitcoin/BitcoinAddress";
import { Button } from "../../components/buttons/Button";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { MSINAMINUTE, MSINASECOND, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMultipleOfferDetails } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { CancelSellOffersPopup } from "../../popups/CancelSellOffersPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import { WronglyFundedPopup } from "../../popups/WronglyFundedPopup";
import { queryClient } from "../../queryClient";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { parseError } from "../../utils/parseError";
import { peachAPI } from "../../utils/peachAPI";
import { isDefined } from "../../utils/validation/isDefined";
import { useWalletState } from "../../utils/wallet/walletStore";
import { getLocalizedLink } from "../../utils/web/getLocalizedLink";
import { openURL } from "../../utils/web/openURL";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { OfferPublished } from "../search/OfferPublished";
import { useOfferMatches } from "../search/hooks/useOfferMatches";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";
import { FundFromPeachWalletButton } from "./FundFromPeachWalletButton";
import { FundingAmount } from "./FundingAmount";
import { TransactionInMempool } from "./components/TransactionInMempool";
import { getFundingAmount } from "./helpers/getFundingAmount";
import { useCreateEscrow } from "./hooks/useCreateEscrow";

const TWENTY = 20;
export const FundEscrow = () => {
  const { offerId } = useRoute<"fundEscrow">().params;
  const showErrorBanner = useShowErrorBanner();

  const fundMultiple = useWalletState((state) =>
    state.getFundMultipleByOfferId(offerId),
  );
  useSyncWallet({
    refetchInterval: fundMultiple ? MSINAMINUTE * 2 : undefined,
    enabled: true,
  });
  const { offers, isPending: offersArePending } = useMultipleOfferDetails(
    fundMultiple?.offerIds || [offerId],
  );
  const offer = offers[0];
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined;
  const canFetchFundingStatus =
    !!sellOffer && shouldGetFundingStatus(sellOffer);

  const {
    data: escrowInfo,
    error: fundingStatusError,
    isPending: fundingStatusIsPending,
  } = useQuery({
    queryKey: offerKeys.escrowInfo(offerId),
    queryFn: getEscrowInfoQuery,
    enabled: canFetchFundingStatus,
    refetchInterval: TWENTY * MSINASECOND,
  });

  const escrows = offers
    .filter(isDefined)
    .filter(isSellOffer)
    .map((offr) => offr.escrow)
    .filter(isDefined);
  const fundingAmount = getFundingAmount(fundMultiple, sellOffer?.amount);

  const fundingStatus = escrowInfo?.funding.status;

  const navigation = useStackNavigation();
  const setPopup = useSetPopup();

  const setOverlay = useSetGlobalOverlay();

  const { refetch: fetchMatches } = useOfferMatches(
    offerId,
    undefined,
    fundingStatus === "FUNDED",
  );

  useEffect(() => {
    if (!sellOffer || !fundingStatus) return;

    if (fundingStatus === "WRONG_FUNDING_AMOUNT") {
      setPopup(<WronglyFundedPopup sellOffer={sellOffer} />);
      return;
    }
    if (escrowInfo.userConfirmationRequired) {
      navigation.replace("wrongFundingAmount", { offerId: sellOffer.id });
      return;
    }
    if (fundingStatus === "FUNDED") {
      void fetchMatches().then(() => {
        navigation.replace("search", { offerId });
        setOverlay(<OfferPublished offerId={offerId} shouldGoBack={false} />);
      });
    }
  }, [
    escrowInfo?.userConfirmationRequired,
    fetchMatches,
    fundingStatus,
    navigation,
    offerId,
    sellOffer,
    setOverlay,
    setPopup,
  ]);

  useEffect(() => {
    if (!fundingStatusError) return;
    showErrorBanner(parseError(fundingStatusError));
  }, [fundingStatusError, showErrorBanner]);

  const offerIdsWithoutEscrow = useMemo(
    () =>
      offers
        .filter(isDefined)
        .filter((o) => !("escrow" in o))
        .map((o) => o.id),
    [offers],
  );

  const fundingAddress = fundMultiple?.address || sellOffer?.escrow;
  const fundingAddresses = escrows;
  const isPending = !!(
    offersArePending ||
    (canFetchFundingStatus && fundingStatusIsPending)
  );
  if (isPending) return <BitcoinLoading text={i18n("sell.escrow.loading")} />;
  if (offerIdsWithoutEscrow.length > 0)
    return <CreateEscrowScreen offerIds={offerIdsWithoutEscrow} />;

  if (!escrowInfo || !fundingAddress || !fundingAddresses || !fundingStatus)
    return <BitcoinLoading text={i18n("sell.escrow.loading")} />;

  if (escrowInfo.funding.status === "MEMPOOL")
    return (
      <TransactionInMempool
        offerId={offerId}
        txId={escrowInfo.funding.txIds[0]}
      />
    );

  return (
    <Screen header={<FundEscrowHeader />}>
      <PeachScrollView contentStyle={tw`items-center gap-4`}>
        <View style={tw`items-center self-stretch justify-center`}>
          <FundingAmount fundingAmount={fundingAmount} />
          <View style={tw`flex-row items-center justify-center gap-1`}>
            <PeachText style={tw`subtitle-1`}>
              {offerIdToHex(offerId)}
            </PeachText>
            <CopyAble value={offerIdToHex(offerId)} textPosition="bottom" />
          </View>
        </View>

        <BitcoinAddress
          address={fundingAddress}
          amount={fundingAmount / SATSINBTC}
          label={`${i18n("settings.escrow.paymentRequest.label")} ${offerIdToHex(offerId)}`}
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
          address={fundingAddress}
          addresses={fundingAddresses}
          amount={fundingAmount}
          fundingStatus={fundingStatus}
          offerId={offerId}
        />
      </View>
    </Screen>
  );
};

function CreateEscrowScreen({ offerIds }: { offerIds: string[] }) {
  const { mutate, isPending } = useCreateEscrow();
  const client = useQueryClient();

  const createEscrow = () => {
    mutate(offerIds, {
      onSuccess: () =>
        Promise.all(
          offerIds.map((id) =>
            client.invalidateQueries({
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
  const navigation = useStackNavigation();

  const { offerId } = useRoute<"fundEscrow">().params;

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
    const goToPreferences = () =>
      navigation.navigate("editPremium", { offerId });
    const icons = [
      { ...headerIcons.sellPreferences, onPress: goToPreferences },
      {
        ...headerIcons.cancel,
        onPress: fundMultiple ? cancelFundMultipleOffers : cancelOffer,
      },
      { ...headerIcons.help, onPress: showHelp },
    ];
    return icons;
  }, [
    cancelFundMultipleOffers,
    cancelOffer,
    fundMultiple,
    showHelp,
    navigation,
    offerId,
  ]);

  return (
    <Header title={i18n("sell.escrow.title")} icons={memoizedHeaderIcons} />
  );
}

function EscrowPopup() {
  const locale = useSettingsStore((state) => state.locale);
  const goToEscrowInfo = () =>
    openURL(getLocalizedLink("terms-and-conditions", locale));

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

function shouldGetFundingStatus(offer: SellOffer) {
  return (
    !!offer.escrow &&
    !offer.refunded &&
    !offer.released &&
    offer.funding.status !== "FUNDED"
  );
}

async function getEscrowInfoQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.escrowInfo>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getEscrowInfo({ offerId });
  if (!fundingStatus || err) {
    throw new Error(err?.error);
  }
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: offerKeys.detail(offerId),
      exact: true,
    }),
    queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
  ]);
  return fundingStatus;
}
