import { ActivityIndicator, Image, View } from "react-native";
import txInMempool from "../../../assets/escrow/tx-in-mempool.png";
import { BitcoinAddress } from "../../../components/bitcoin/BitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import { SimpleTimer, Timer } from "../../../components/text/Timer";
import { useFundingStatus } from "../../../hooks/query/useFundingStatus";
import tw from "../../../styles/tailwind";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import i18n from "../../../utils/i18n";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { FundFromPeachWalletButton } from "../../fundEscrow/FundFromPeachWalletButton";
import { FundingAmount } from "../../fundEscrow/FundingAmount";
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
          The seller has funded the escrow!{"\n\n"}Once his transaction has been
          confirmed, you will be able to see the payment details
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
        The seller hasn't funded the escrow yet
      </PeachText>
      <Image
        source={txInMempool}
        style={{ width: 311, height: 224 }}
        resizeMode="contain"
      />
      <Timer
        text="seller should fund the escrow in"
        end={contract.fundingExpectedBy.getTime()}
      />
    </View>
  );
}

function SellerFundEscrow() {
  const { contract } = useContractContext();
  const sellOfferId = getSellOfferIdFromContract(contract);
  const { fundingStatus, isLoading } = useFundingStatus(sellOfferId);
  if (isLoading) return <ActivityIndicator size="large" />;
  if (fundingStatus?.status === "MEMPOOL") {
    return (
      <View style={tw`items-center justify-center gap-8 grow`}>
        <PeachText style={tw`body-l`}>
          Your bitcoin transaction is pending...
        </PeachText>
        <Image
          source={txInMempool}
          style={{ width: 311, height: 224 }}
          resizeMode="contain"
        />
        <Timer
          text="you should fund within"
          end={contract.fundingExpectedBy.getTime()}
        />
      </View>
    );
  }
  return (
    <View style={tw`items-center gap-4 grow`}>
      <View style={tw`items-center justify-center gap-1`}>
        <PeachText style={tw`h6`}>you should fund within</PeachText>
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
