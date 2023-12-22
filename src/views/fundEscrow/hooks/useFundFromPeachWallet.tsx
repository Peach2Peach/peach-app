import { PartiallySignedTransaction } from 'bdk-rn'
import { TransactionDetails, TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useSetPopup } from '../../../components/popup/Popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { ClosePopupAction } from '../../../popups/actions/ClosePopupAction'
import { useConfigStore } from '../../../store/configStore/configStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result/parseError'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildTransaction, setMultipleRecipients } from '../../../utils/wallet/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from '../../wallet/hooks/useSyncWallet'
import { AmountTooLow } from '../components/AmountTooLow'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'
import { ConfirmTransactionPopup } from './ConfirmTransactionPopup'
import { useOptimisticTxHistoryUpdate } from './useOptimisticTxHistoryUpdate'

const getPropsFromFinishedTransaction = async (
  psbt: PartiallySignedTransaction,
  { sent, received }: TransactionDetails,
) => ({
  amountToConfirm: sent - received,
  fee: await psbt.feeAmount(),
})

type FundFromWalletParams = {
  offerId: string
  amount: number
  fundingStatus?: FundingStatus['status']
  address?: string
  addresses?: string[]
}

type OnSuccessParams = {
  txDetails: TransactionDetails
  offerId: string
  address: string
  addresses: string[]
}

export const useFundFromPeachWallet = () => {
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)
  const showErrorBanner = useShowErrorBanner()
  const handleTransactionError = useHandleTransactionError()
  const optimisticTxHistoryUpdate = useOptimisticTxHistoryUpdate()
  const { refresh: syncPeachWallet } = useSyncWallet()

  const feeRate = useFeeRate()
  const [setFundedFromPeachWallet, unregisterFundMultiple] = useWalletState(
    (state) => [state.setFundedFromPeachWallet, state.unregisterFundMultiple],
    shallow,
  )
  const setPopup = useSetPopup()

  const onSuccess = useCallback(
    ({ txDetails, offerId, address, addresses }: OnSuccessParams) => {
      optimisticTxHistoryUpdate(txDetails, offerId)
      unregisterFundMultiple(address)
      setFundedFromPeachWallet(address)
      addresses.forEach(setFundedFromPeachWallet)
    },
    [optimisticTxHistoryUpdate, setFundedFromPeachWallet, unregisterFundMultiple],
  )

  const fundFromPeachWallet = useCallback(
    async ({ offerId, amount, fundingStatus = 'NULL', address, addresses = [] }: FundFromWalletParams) => {
      if (!address || !amount || fundingStatus !== 'NULL') return undefined
      await syncPeachWallet()
      if (peachWallet.balance < (addresses.length || 1) * minTradingAmount) {
        return setPopup(
          <AmountTooLowPopup available={peachWallet.balance} needed={(addresses.length || 1) * minTradingAmount} />,
        )
      }

      let finishedTransaction: TxBuilderResult
      try {
        const transaction = await buildTransaction({ feeRate })
        if (addresses.length > 0) await setMultipleRecipients(transaction, amount, addresses)

        finishedTransaction = await peachWallet.finishTransaction(transaction)
      } catch (e) {
        const transactionError = parseError(Array.isArray(e) ? e[0] : e)
        if (transactionError !== 'INSUFFICIENT_FUNDS') return showErrorBanner(transactionError)

        if (addresses.length > 1) {
          const { available } = Array.isArray(e) ? e[1] : { available: 0 }
          return showErrorBanner('INSUFFICIENT_FUNDS', [amount, available])
        }

        try {
          const transaction = await buildTransaction({ address, feeRate, shouldDrainWallet: true })
          finishedTransaction = await peachWallet.finishTransaction(transaction)
          const { txDetails, psbt } = finishedTransaction
          const { amountToConfirm, fee } = await getPropsFromFinishedTransaction(psbt, txDetails)
          return setPopup(
            <ConfirmTransactionPopup
              title={i18n('fundFromPeachWallet.insufficientFunds.title')}
              content={<ConfirmFundingWithInsufficientFunds amount={amountToConfirm} {...{ address, feeRate, fee }} />}
              psbt={psbt}
              onSuccess={() => onSuccess({ txDetails, offerId, address, addresses })}
            />,
          )
        } catch (e2) {
          return handleTransactionError(e2)
        }
      }

      const { txDetails, psbt } = finishedTransaction
      const { amountToConfirm, fee } = await getPropsFromFinishedTransaction(psbt, txDetails)
      return setPopup(
        <ConfirmTransactionPopup
          title={i18n('fundFromPeachWallet.confirm.title')}
          content={<ConfirmFundingFromPeachWallet amount={amountToConfirm} {...{ address, feeRate, fee }} />}
          psbt={psbt}
          onSuccess={() => onSuccess({ txDetails, offerId, address, addresses })}
        />,
      )
    },
    [feeRate, handleTransactionError, minTradingAmount, onSuccess, setPopup, showErrorBanner],
  )

  return fundFromPeachWallet
}

function AmountTooLowPopup (contentProps: { available: number; needed: number }) {
  return (
    <PopupComponent
      title={i18n('fundFromPeachWallet.amountTooLow.title')}
      content={<AmountTooLow {...contentProps} />}
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  )
}
