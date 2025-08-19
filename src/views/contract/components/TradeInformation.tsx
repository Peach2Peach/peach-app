import { ActivityIndicator, Image, View } from "react-native";
import txInMempool from "../../../assets/escrow/tx-in-mempool.png";
import { BitcoinAddress } from "../../../components/bitcoin/BitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import { SimpleTimer, Timer } from "../../../components/text/Timer";
import { useFundingStatus } from "../../../hooks/query/useFundingStatus";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import tw from "../../../styles/tailwind";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import i18n from "../../../utils/i18n";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";
import { FundFromPeachWalletButton } from "../../fundEscrow/FundFromPeachWalletButton";
import { FundingAmount } from "../../fundEscrow/FundingAmount";
import { useContractContext } from "../context";
import { shouldShowTradeStatusInfo } from "../helpers/shouldShowTradeStatusInfo";
import { TradeDetails } from "./TradeDetails";
import { TradeStatusInfo } from "./TradeStatusInfo";

export const isFundingTradeStatus = (tradeStatus: string): boolean => {
  return [
    "createEscrow",
    "fundEscrow",
    "waitingForFunding",
    "escrowWaitingForConfirmation",
  ].includes(tradeStatus);
};

export const TradeInformation = () => {
  const { contract, view } = useContractContext();

  if (isFundingTradeStatus(contract.tradeStatus)) {
    return <FundEscrow />;
  }
  return shouldShowTradeStatusInfo(contract, view) ? (
    <TradeStatusInfo />
  ) : (
    <TradeDetails />
  );
};

function FundEscrow() {
  const { view } = useContractContext();
  return (
    <View style={tw`grow`}>
      {view === "buyer" ? <BuyerFundEscrow /> : <SellerFundEscrow />}
    </View>
  );
}

function BuyerFundEscrow() {
  const { contract } = useContractContext();
  if (!contract.fundingExpectedBy)
    throw Error("expected contract.fundingExpectedBy");
  const { fundingStatus, isLoading } = useFundingStatus(
    getSellOfferIdFromContract(contract),
  );

  if (isLoading) return <ActivityIndicator size="large" />;
  if (
    fundingStatus?.status === "MEMPOOL" ||
    fundingStatus?.status === "FUNDED" // for regtest purposes TODO validate this (came from p4t)
  ) {
    return (
      <View style={tw`items-center justify-center gap-8 grow`}>
        <PeachText style={tw`text-center body-l`}>
          {i18n("offer.sellerSuccessfullyFunded")}
        </PeachText>
        <Image
          source={txInMempool}
          style={{ width: 311, height: 224 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View style={tw`items-center justify-center gap-8 grow`}>
      <PeachText style={tw`body-l`}>
        {i18n("offer.requiredAction.sellerHasntFunded")}
      </PeachText>
      <Image
        source={txInMempool}
        style={{ width: 311, height: 224 }}
        resizeMode="contain"
      />
      <Timer
        text={i18n("offer.requiredAction.sellerShouldFundIn")}
        end={contract.fundingExpectedBy}
      />
    </View>
  );
}

function SellerFundEscrow() {
  const { contract } = useContractContext();
  if (!contract.fundingExpectedBy)
    throw Error("expected contract.fundingExpectedBy");
  const sellOfferId = getSellOfferIdFromContract(contract);
  const { fundingStatus, isLoading } = useFundingStatus(sellOfferId);

  const [showPopup, toggle] = useToggleBoolean(true);

  // const setOverlay = useSetGlobalOverlay();
  // useEffect(() => {
  //   if (fundingStatus?.status === "FUNDED" && showPopup) {
  //     toggle();
  //     setOverlay(
  //       <EscrowOfContractFunded
  //         shouldGoBack={false}
  //         contractId={contract.id}
  //       />,
  //     );
  //   }
  // }, [fundingStatus, contract.id, setOverlay, toggle, showPopup]);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (fundingStatus?.status === "MEMPOOL") {
    return (
      <View style={tw`items-center justify-center gap-8 grow`}>
        <PeachText style={tw`body-l`}>
          {i18n("offer.escrow.transactionPending")}
        </PeachText>
        <Image
          source={txInMempool}
          style={{ width: 311, height: 224 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View style={tw`items-center gap-4 grow`}>
      <View style={tw`items-center justify-center gap-1`}>
        <PeachText style={tw`h6 text-center`}>
          {i18n("offer.fundWithin")}
        </PeachText>
        <SimpleTimer
          style={tw`h5 text-error-main`}
          end={contract.fundingExpectedBy}
        />
      </View>
      <FundingAmount fundingAmount={contract.amount} />
      {!!contract.escrow && !!fundingStatus && (
        <>
          <BitcoinAddress
            address={contract.escrow}
            label={`${i18n("settings.escrow.paymentRequest.label")} ${offerIdToHex(sellOfferId)}`}
          />
          <FundFromPeachWalletButton
            address={contract.escrow}
            addresses={[contract.escrow]}
            amount={contract.amount}
            fundingStatus={fundingStatus}
          />
        </>
      )}
    </View>
  );
}
