import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import i18n from '../../../utils/i18n'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'
import { useShowConfirmTransactionPopup } from './useShowConfirmTransactionPopup'

type Props = {
  address: string
  transaction: TxBuilderResult
  feeRate: number
  onSuccess: (tx: TxBuilderResult) => void
}

export const useShowInsufficientFundsPopup = () => {
  const showConfirmTransactionPopup = useShowConfirmTransactionPopup()

  const showInsufficientFundsPopup = useCallback(
    async ({ address, transaction, feeRate, onSuccess }: Props) => {
      const fee = await transaction.psbt.feeAmount()

      showConfirmTransactionPopup({
        title: i18n('fundFromPeachWallet.insufficientFunds.title'),
        content: (
          <ConfirmFundingWithInsufficientFunds
            amount={transaction.txDetails.sent - transaction.txDetails.received}
            {...{ address, fee, feeRate }}
          />
        ),
        transaction,
        onSuccess,
      })
    },
    [showConfirmTransactionPopup],
  )

  return showInsufficientFundsPopup
}
