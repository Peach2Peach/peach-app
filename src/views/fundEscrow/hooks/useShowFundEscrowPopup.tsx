import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import i18n from '../../../utils/i18n'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { useShowConfirmTransactionPopup } from './useShowConfirmTransactionPopup'

type Props = {
  address: string
  amount?: number
  transaction: TxBuilderResult
  feeRate: number
  onSuccess: (tx: TxBuilderResult) => void
}

export const useShowFundEscrowPopup = () => {
  const showConfirmTransactionPopup = useShowConfirmTransactionPopup()

  const showFundEscrowPopup = useCallback(
    async ({ address, transaction, feeRate, onSuccess }: Props) => {
      const fee = await transaction.psbt.feeAmount()

      showConfirmTransactionPopup({
        title: i18n('fundFromPeachWallet.confirm.title'),
        content: (
          <ConfirmFundingFromPeachWallet
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

  return showFundEscrowPopup
}
