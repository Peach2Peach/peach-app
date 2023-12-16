import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useNavigation } from '../../../hooks'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { BuildTxParams } from '../../../utils/wallet/transaction/buildTransaction'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const setSelectedUTXOIds = useWalletState((state) => state.setSelectedUTXOIds)
  const navigation = useNavigation()
  const handleTransactionError = useHandleTransactionError()

  const openWithdrawalConfirmationPopup = useCallback(
    async (buildTxParams: BuildTxParams & { amount: number; feeRate: number; address: string }) => {
      try {
        const { psbt } = await peachWallet.buildFinishedTransaction(buildTxParams)

        const confirm = async () => {
          try {
            await peachWallet.signAndBroadcastPSBT(psbt)
          } catch (e) {
            handleTransactionError(e)
          }
          setSelectedUTXOIds([])
          closePopup()
          navigation.navigate('homeScreen', { screen: 'wallet' })
        }
        const fee = await psbt.feeAmount()

        setPopup(
          <PopupComponent
            title={i18n('wallet.confirmWithdraw.title')}
            content={<WithdrawalConfirmation {...{ ...buildTxParams, fee }} />}
            actions={
              <>
                <PopupAction label={i18n('cancel')} iconId="xCircle" onPress={closePopup} />
                <PopupAction
                  label={i18n('wallet.confirmWithdraw.confirm')}
                  iconId="arrowRightCircle"
                  onPress={confirm}
                  reverseOrder
                />
              </>
            }
          />,
        )
      } catch (e) {
        handleTransactionError(e)
      }
    },
    [closePopup, handleTransactionError, navigation, setPopup, setSelectedUTXOIds],
  )
  return openWithdrawalConfirmationPopup
}
