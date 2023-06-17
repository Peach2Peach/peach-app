import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useRoute, useShowHelp } from '../../../hooks'
import { useHandleBroadcastError } from '../../../hooks/error/useHandleBroadcastError'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout'
import { getErrorsInField } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildBumpFeeTransaction } from '../../../utils/wallet/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { ConfirmRbf } from '../components/ConfirmRbf'
import { BumpFeeTxBuilder } from 'bdk-rn'

export const useBumpNetworkFeesSetup = () => {
  const { txId } = useRoute<'bumpNetworkFees'>().params
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const handleBroadcastError = useHandleBroadcastError()
  const navigation = useNavigation()
  const showHelp = useShowHelp('rbf')
  const localTransaction = useWalletState((state) => state.getTransaction(txId))
  const { transaction } = useTransactionDetails({ txId })
  const { estimatedFees } = useFeeEstimate()
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const [newFeeRate, setNewFeeRate] = useState(String(currentFeeRate))
  const newFeeRateRules = useMemo(() => ({ min: currentFeeRate + 1, required: true, feeRate: true }), [currentFeeRate])
  const newFeeRateErrors = useMemo(() => getErrorsInField(newFeeRate, newFeeRateRules), [newFeeRate, newFeeRateRules])
  const newFeeRateIsValid = newFeeRate && newFeeRateErrors.length === 0
  const overpayingBy = Number(newFeeRate) / estimatedFees.fastestFee - 1

  useHeaderSetup({
    title: i18n('wallet.bumpNetworkFees.title'),
    icons: [{ ...headerIcons.help, onPress: showHelp }],
  })

  const confirmAndSend = async (psbt: BumpFeeTxBuilder) => {
    showLoadingPopup({
      title: i18n('wallet.bumpNetworkFees.confirmRbf.title'),
      level: 'APP',
    })
    try {
      await peachWallet.signAndBroadcastPSBT(psbt)
      navigation.goBack()
    } catch (e) {
      handleBroadcastError(e)
    } finally {
      closePopup()
    }
  }

  const bumpFees = async () => {
    if (!transaction || !newFeeRateIsValid || !localTransaction) return
    const bumpFeeTransaction = await buildBumpFeeTransaction(txId, Number(newFeeRate))

    setPopup({
      title: i18n('wallet.bumpNetworkFees.confirmRbf.title'),
      level: 'APP',
      content: (
        <ConfirmRbf
          oldFeeRate={currentFeeRate}
          newFeeRate={Number(newFeeRate)}
          bytes={transaction.size}
          sendingAmount={localTransaction.sent - localTransaction.received}
        />
      ),
      action1: {
        label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
        icon: 'arrowRightCircle',
        callback: () => confirmAndSend(bumpFeeTransaction),
      },
      action2: {
        label: i18n('close'),
        icon: 'xCircle',
        callback: closePopup,
      },
    })
  }

  return {
    transaction,
    currentFeeRate,
    newFeeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    newFeeRateErrors,
    estimatedFees,
    overpayingBy,
    bumpFees,
  }
}
