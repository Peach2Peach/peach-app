import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { useCallback } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../../components/text/PeachText";
import { useLiquidFeeRate } from "../../../hooks/useLiquidFeeRate";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useConfigStore } from "../../../store/configStore/configStore";
import tw from "../../../styles/tailwind";
import { selectUTXONewestFirst } from "../../../utils/blockchain/selectUTXONewestFirst";
import i18n from "../../../utils/i18n";
import { ceil } from "../../../utils/math/ceil";
import { floor } from "../../../utils/math/floor";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";
import { handleTransactionError as parseTransactionError } from "../../../utils/wallet/error/handleTransactionError";
import { buildTransactionWithFeeRate } from "../../../utils/wallet/liquid/buildTransactionWithFeeRate";
import { estimateMiningFees } from "../../../utils/wallet/liquid/estimateMiningFees";
import { peachLiquidWallet } from "../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../utils/wallet/useLiquidWalletState";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useSyncLiquidWallet } from "../../wallet/hooks/useSyncLiquidWallet";
import { ConfirmTransactionPopup } from "./ConfirmTransactionPopup";
import { ConfirmTxPopup } from "./ConfirmTxPopup";

type FundFromWalletLiquidParams = {
  amount: number;
  fundingStatus?: FundingStatus["status"];
  address?: string;
  addresses?: string[];
};

type OnSuccessParams = {
  address: string;
  addresses: string[];
};

export const useFundFromPeachLiquidWallet = () => {
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount);
  const showErrorBanner = useShowErrorBanner();
  const { refetch: syncPeachLiquidWallet } = useSyncLiquidWallet();

  const feeRate = useLiquidFeeRate();
  const [setFundedFromPeachWallet, unregisterFundMultiple] = useWalletState(
    (state) => [state.setFundedFromPeachWallet, state.unregisterFundMultiple],
    shallow,
  );
  const setPopup = useSetPopup();

  const onSuccess = useCallback(
    ({ address, addresses }: OnSuccessParams) => {
      unregisterFundMultiple(address);
      setFundedFromPeachWallet(address);
      addresses.forEach(setFundedFromPeachWallet);
    },
    [setFundedFromPeachWallet, unregisterFundMultiple],
  );

  const drainWalletToFund = useCallback(
    ({ address }: { address: string }) => {
      if (!peachLiquidWallet)
        throw new Error("Peach liquid wallet not defined");
      const balance = useLiquidWalletState.getState().balance;
      let transaction: LiquidTransaction;
      let miningFees = 0;
      try {
        miningFees = estimateMiningFees({
          recipients: [{ address, amount: balance }],
          feeRate,
          inputs: selectUTXONewestFirst(peachLiquidWallet.utxos, balance),
        }).miningFees;
        transaction = buildTransactionWithFeeRate({
          recipients: [{ address, amount: balance - miningFees }],
          feeRate,
          inputs: selectUTXONewestFirst(peachLiquidWallet.utxos, balance),
        });
        return setPopup(
          <ConfirmTransactionPopup
            title={i18n("fundFromPeachWallet.insufficientFunds.title")}
            content={
              <ConfirmTxPopup
                amount={balance}
                {...{
                  address,
                  fee: ceil(transaction.virtualSize() * feeRate),
                  feeRate,
                }}
                text={i18n(
                  "fundFromPeachWallet.insufficientFunds.description.1",
                )}
                secondText={i18n(
                  "fundFromPeachWallet.insufficientFunds.description.2",
                )}
              />
            }
            onConfirm={() =>
              peachAPI.public.liquid.postTx({ tx: transaction.toHex() })
            }
            onSuccess={() => onSuccess({ address, addresses: [] })}
          />,
        );
      } catch (e) {
        const transactionError = parseTransactionError(parseError(e));
        if (transactionError[0].message !== "INSUFFICIENT_FUNDS") {
          return showErrorBanner(transactionError[0]);
        }

        const { available } = transactionError[1] || { available: 0 };
        return showErrorBanner(
          "INSUFFICIENT_FUNDS",
          [balance - miningFees, available].map(String),
        );
      }
    },
    [feeRate, onSuccess, setPopup, showErrorBanner],
  );

  const fundFromPeachWallet = useCallback(
    async ({
      amount,
      fundingStatus = "NULL",
      address,
      addresses = [],
    }: FundFromWalletLiquidParams) => {
      if (!address || !amount || fundingStatus !== "NULL") return undefined;
      if (!peachLiquidWallet)
        throw new Error("Peach liquid wallet not defined");
      await syncPeachLiquidWallet();
      const balance = useLiquidWalletState.getState().balance;

      const neededAmount = (addresses.length || 1) * minTradingAmount;
      if (balance < neededAmount) {
        return setPopup(
          <AmountTooLowPopup available={balance} needed={neededAmount} />,
        );
      }

      let transaction: LiquidTransaction;
      try {
        const recipients =
          addresses.length > 0
            ? addresses.map((addr) => ({
                address: addr,
                amount: floor(amount / addresses.length),
              }))
            : [{ address, amount }];
        transaction = buildTransactionWithFeeRate({
          feeRate,
          recipients,
          inputs: selectUTXONewestFirst(peachLiquidWallet.utxos, amount),
        });
      } catch (e) {
        const parsedError = parseError(e);
        const transactionError = parseTransactionError(parsedError);
        if (transactionError[0].message !== "INSUFFICIENT_FUNDS") {
          return showErrorBanner(transactionError[0]);
        }

        if (addresses.length > 1) {
          const { available } = transactionError[1] || { available: 0 };
          return showErrorBanner(
            "INSUFFICIENT_FUNDS",
            [amount, available].map(String),
          );
        }

        return drainWalletToFund({ address });
      }

      return setPopup(
        <ConfirmTransactionPopup
          title={i18n("fundFromPeachWallet.confirm.title")}
          content={
            <ConfirmTxPopup
              text={i18n("fundFromPeachWallet.confirm.description")}
              amount={amount}
              {...{
                address,
                feeRate,
                fee: ceil(transaction.virtualSize() * feeRate),
              }}
            />
          }
          onConfirm={() =>
            peachAPI.public.liquid.postTx({ tx: transaction.toHex() })
          }
          onSuccess={() => onSuccess({ address, addresses })}
        />,
      );
    },
    [
      drainWalletToFund,
      feeRate,
      minTradingAmount,
      onSuccess,
      setPopup,
      showErrorBanner,
      syncPeachLiquidWallet,
    ],
  );

  return fundFromPeachWallet;
};

function AmountTooLowPopup({
  available,
  needed,
}: {
  available: number;
  needed: number;
}) {
  return (
    <PopupComponent
      title={i18n("fundFromPeachWallet.amountTooLow.title")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>
            {i18n("fundFromPeachWallet.amountTooLow.description.1")}
          </PeachText>
          <BTCAmount amount={available} size="medium" />
          <PeachText>
            {i18n("fundFromPeachWallet.amountTooLow.description.2")}
          </PeachText>
          <BTCAmount amount={needed} size="medium" />
        </View>
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
