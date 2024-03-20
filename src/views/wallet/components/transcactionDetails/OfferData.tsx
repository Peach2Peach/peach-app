import { Transaction } from "bitcoinjs-lib";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { View } from "react-native";
import { CopyableSummaryItem } from "../../../../components/summaryItem";
import { AddressSummaryItem } from "../../../../components/summaryItem/AddressSummaryItem";
import { AmountSummaryItem } from "../../../../components/summaryItem/AmountSummaryItem";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { numberConverter } from "../../../../utils/math/numberConverter";
import { priceFormat } from "../../../../utils/string/priceFormat";
import { scriptToAddress } from "../../helpers/getAddressesFromOutputs";

type OfferDataProps = ComponentProps & {
  price?: number;
  amount: number;
  currency?: Currency;
  address?: string;
  type: TransactionType;
  chain: Chain;
  transactionDetails: Transaction | LiquidTransaction;
};
export const OfferData = ({
  price,
  currency,
  amount: offerAmount,
  address,
  type,
  chain,
  transactionDetails,
  ...componentProps
}: OfferDataProps) => {
  const amount = numberConverter(
    transactionDetails?.outs.find(
      (v) =>
        v.script.byteLength > 1 && scriptToAddress(v.script, chain) === address,
    )?.value || offerAmount,
  );
  return (
    <View style={tw`gap-4`} {...componentProps}>
      <AmountSummaryItem chain={chain} amount={amount} />

      {price && currency && type !== "REFUND" && (
        <CopyableSummaryItem
          title={i18n("price")}
          text={`${priceFormat(price)} ${currency}`}
        />
      )}
      <AddressSummaryItem title={i18n("to")} address={address} />
    </View>
  );
};
