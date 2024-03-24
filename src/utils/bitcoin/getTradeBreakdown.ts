import {
  Network as BitcoinNetwork,
  Transaction as BitcoinTransaction,
  address as bitcoinAddress,
} from "bitcoinjs-lib";
import {
  Transaction as LiquidTransaction,
  address as liquidAddress,
  networks as liquidNetworks,
} from "liquidjs-lib";
import { log } from "../log/log";
import { numberConverter } from "../math/numberConverter";
import { isLiquidAddress } from "../validation/rules";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";

type TradeBreakdown = {
  totalAmount: number;
  peachFee: number;
  networkFee: number;
  amountReceived: number;
};

type BaseProps = {
  releaseTransaction?: string;
  releaseAddress: string;
  inputAmount: number;
  discount?: number;
};

type BitcoinProps = BaseProps & {
  address: typeof bitcoinAddress;
  Transaction: typeof BitcoinTransaction;
  network: BitcoinNetwork;
};
type LiquidProps = BaseProps & {
  address: typeof liquidAddress;
  Transaction: typeof LiquidTransaction;
  network: liquidNetworks.Network;
};

function getTradeBreakdownBase(props: BitcoinProps): TradeBreakdown;
function getTradeBreakdownBase(props: LiquidProps): TradeBreakdown;
function getTradeBreakdownBase({
  releaseTransaction,
  releaseAddress,
  inputAmount,
  address,
  Transaction,
  network,
}: BitcoinProps | LiquidProps): TradeBreakdown {
  try {
    if (!releaseTransaction) throw new Error("No release transaction provided");

    const transaction = Transaction.fromHex(releaseTransaction);
    const outputs = transaction.outs;
    const releaseOutput = outputs.find(
      (output) =>
        // @ts-ignore if you know how to satisfy typescript, please fix
        address.fromOutputScript(output.script, network) === releaseAddress,
    );
    if (!releaseOutput)
      return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 };

    const peachFeeOutput = outputs.find(
      (output) =>
        // @ts-ignore if you know how to satisfy typescript, please fix
        address.fromOutputScript(output.script, network) !== releaseAddress,
    ) || { value: 0 };
    const networkFee =
      inputAmount -
      numberConverter(peachFeeOutput.value) -
      numberConverter(releaseOutput.value);

    return {
      totalAmount: inputAmount,
      peachFee: numberConverter(peachFeeOutput.value),
      networkFee,
      amountReceived: numberConverter(releaseOutput.value),
    };
  } catch (error) {
    log(
      "error",
      "Error getting trade breakdown: ",
      error,
      "\n for this tx: ",
      releaseTransaction,
    );
    return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 };
  }
}

export const getTradeBreakdown = ({
  releaseTransaction,
  releaseAddress,
  inputAmount,
}: BaseProps) =>
  isLiquidAddress(releaseAddress, getLiquidNetwork())
    ? getTradeBreakdownBase({
        releaseTransaction,
        releaseAddress,
        inputAmount,
        Transaction: LiquidTransaction,
        address: liquidAddress,
        network: getLiquidNetwork(),
      })
    : getTradeBreakdownBase({
        releaseTransaction,
        releaseAddress,
        inputAmount,
        Transaction: BitcoinTransaction,
        address: bitcoinAddress,
        network: getNetwork(),
      });
