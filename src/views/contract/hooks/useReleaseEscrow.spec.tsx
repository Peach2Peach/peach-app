import { renderHook } from '@testing-library/react-native'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { saveContract } from '../../../utils/contract'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'
import i18n from '../../../utils/i18n'
import { useReleaseEscrow } from './useReleaseEscrow'

const showErrorMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
}))

jest.mock('../../../utils/contract')

const confirmPaymentMock = jest.fn().mockResolvedValue([{}, null])
jest.mock('../../../utils/peachAPI', () => ({
  confirmPayment: (...args: unknown[]) => confirmPaymentMock(...args),
}))

const signReleaseTxOfContractMock = jest.fn().mockReturnValue({
  releaseTransaction: 'tx',
  batchReleasePsbt: 'batchRelasePsbt',
  errorMsg: undefined,
})
jest.mock('../../../utils/contract/signReleaseTxOfContract', () => ({
  signReleaseTxOfContract: jest.fn((...args: unknown[]) => signReleaseTxOfContractMock(...args)),
}))

const DATE_TO_USE = new Date('2009-09-01')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)

describe('useReleaseEscrow', () => {
  const contract = {} as Contract

  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should show the loading popup', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      content: PopupLoadingSpinner,
      title: i18n('dispute.lost'),
      level: 'WARN',
    })
  })

  it('should sign the release transaction', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(signReleaseTxOfContract).toHaveBeenCalledWith(contract)
  })

  it('should close the popup and show an error if the transaction could not be signed', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    signReleaseTxOfContractMock.mockReturnValueOnce({ errorMsg: 'error' })
    await result.current()
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(showErrorMock).toHaveBeenCalledWith('error')
  })

  it('should confirm the payment', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(confirmPaymentMock).toHaveBeenCalledWith({
      contractId: contract.id,
      releaseTransaction: 'tx',
      batchReleasePsbt: 'batchRelasePsbt',
    })
  })

  it('should close the popup and show an error if the payment could not be confirmed', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    confirmPaymentMock.mockReturnValueOnce([null, { error: 'error' }])
    await result.current()
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(showErrorMock).toHaveBeenCalledWith('error')
  })

  it('should save the contract', async () => {
    confirmPaymentMock.mockReturnValueOnce([{ txId: 'txId' }, null])
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(saveContract).toHaveBeenCalledWith({
      ...contract,
      paymentConfirmed: DATE_TO_USE,
      cancelConfirmationDismissed: true,
      releaseTxId: 'txId',
      disputeResultAcknowledged: true,
      disputeResolvedDate: DATE_TO_USE,
    })
  })

  it('should close the popup', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
