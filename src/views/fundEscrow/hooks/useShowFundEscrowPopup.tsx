import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import i18n from '../../../utils/i18n'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { useShowConfirmTransactionPopup } from './useShowConfirmTransactionPopup'

type Props = { address: string; transaction: TxBuilderResult; feeRate: number; onSuccess: Function }

export const useShowFundEscrowPopup = () => {
  const showConfirmTransactionPopup = useShowConfirmTransactionPopup()

  const showFundEscrowPopup = useCallback(
    async ({ address, transaction, feeRate, onSuccess }: Props) => {
      const fee = await transaction.psbt.feeAmount()

      showConfirmTransactionPopup({
        title: i18n('fundFromPeachWallet.confirm.title'),
        content: (
          <ConfirmFundingFromPeachWallet
            amount={transaction.txDetails.sent}
            address={address}
            fee={fee}
            feeRate={feeRate}
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
