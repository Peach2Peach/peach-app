import { ActivityIndicator, Image, View } from "react-native";
import txInMempool from "../../../assets/escrow/tx-in-mempool.png";
import { BitcoinAddress } from "../../../components/bitcoin/BitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import { SimpleTimer, Timer } from "../../../components/text/Timer";
import { useFundingStatus } from "../../../hooks/query/useFundingStatus";
import tw from "../../../styles/tailwind";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import i18n from "../../../utils/i18n";
import { getOffer } from "../../../utils/offer/getOffer";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { FundFromPeachWalletButton } from "../../fundEscrow/FundFromPeachWalletButton";
import { FundingAmount } from "../../fundEscrow/FundingAmount";
import { useHandleFundingStatus } from "../../fundEscrow/hooks/useHandleFundingStatus";
import { useContractContext } from "../context";
import { shouldShowTradeStatusInfo } from "../helpers/shouldShowTradeStatusInfo";
import { TradeDetails } from "./TradeDetails";
import { TradeStatusInfo } from "./TradeStatusInfo";

export const TradeInformation = () => {
  const { contract, view } = useContractContext();
  if (
    ["createEscrow", "fundEscrow", "waitingForFunding"].includes(
      contract.tradeStatus,
    )
  ) {
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
  const { fundingStatus, isLoading } = useFundingStatus(
    getSellOfferIdFromContract(contract),
  );
  if (isLoading) return <ActivityIndicator size="large" />;
  if (fundingStatus?.status === "MEMPOOL") {
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
        end={contract.fundingExpectedBy.getTime()}
      />
    </View>
  );
}

function SellerFundEscrow() {
  const { contract } = useContractContext();
  const sellOfferId = getSellOfferIdFromContract(contract);
  const { fundingStatus, isLoading } = useFundingStatus(sellOfferId);

  const sellOffer = getOffer(sellOfferId) as SellOffer;

  useHandleFundingStatus({
    offerId: sellOfferId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired: false,
    contractId: contract.id,
  });

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
        <Timer
          text={i18n("offer.fundWithin")}
          end={contract.fundingExpectedBy.getTime()}
        />
      </View>
    );
  }
  return (
    <View style={tw`items-center gap-4 grow`}>
      <View style={tw`items-center justify-center gap-1`}>
        <PeachText style={tw`h6`}>{i18n("offer.fundWithin")}</PeachText>
        <SimpleTimer
          style={tw`h5 text-error-main`}
          end={contract.fundingExpectedBy.getTime()}
        />
      </View>
      <FundingAmount fundingAmount={contract.amount} />
      {!!contract.escrow && !!fundingStatus && (
        <>
          <BitcoinAddress
            address={contract.escrow}
            label={`${i18n("settings.escrow.paymentRequest.label")} ${offerIdToHex(sellOfferId)}`}
          />
          {!!peachWallet?.balance && peachWallet.balance > contract.amount && (
            <FundFromPeachWalletButton
              amount={contract.amount}
              offerId={sellOfferId}
              address={contract.escrow}
              addresses={[contract.escrow]}
              fundingStatus={fundingStatus}
            />
          )}
        </>
      )}
    </View>
  );
}
