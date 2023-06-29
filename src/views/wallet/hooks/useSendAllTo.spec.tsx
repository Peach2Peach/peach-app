import { act, renderHook } from '@testing-library/react-native'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSendAllTo } from './useSendAllTo'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

const wrapper = NavigationWrapper
describe('useSendAllTo', () => {
  const onSuccess = jest.fn()
  const address = 'bitcoinAddress'
  const initialProps = { address, onSuccess }
  const balance = 21000000
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const transaction = getTransactionDetails(balance, feeRate)

  // @ts-ignore
  const peachWallet = new PeachWallet()

  beforeAll(() => {
    useWalletState.getState().setBalance(balance)
    setPeachWallet(peachWallet)
  })

  it('should open confirm withdrawal popup', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)

    const { result } = renderHook(useSendAllTo, { wrapper, initialProps })

    await act(async () => {
      await result.current()
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'sending funds',
      content: <WithdrawalConfirmation {...{ address, amount: balance, fee, feeRate }} />,
      visible: true,
      action2: {
        callback: expect.any(Function),
        label: 'cancel',
        icon: 'xCircle',
      },
      action1: {
        callback: expect.any(Function),
        label: 'confirm & send',
        icon: 'arrowRightCircle',
      },
      level: 'APP',
    })
  })
  it('should confirm withdrawal with correct fees', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useSendAllTo, { wrapper, initialProps })

    await act(async () => {
      await result.current()
    })
    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(onSuccess).toHaveBeenCalledWith('txId')
  })
  it('should handle transaction errors', async () => {
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useSendAllTo, { wrapper, initialProps })

    await act(async () => {
      await result.current()
    })
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
