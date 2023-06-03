import { useReleaseEscrow } from './useReleaseEscrow'
import { saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI/private/contract/confirmPayment'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'
import { renderHook } from '@testing-library/react-native'

const updateOverlayMock = jest.fn()
jest.mock('../../../contexts/overlay', () => ({
  useOverlayContext: jest.fn(() => [{}, updateOverlayMock]),
}))

const showErrorMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
}))

const showLoadingOverlayMock = jest.fn()
jest.mock('../../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: jest.fn(() => showLoadingOverlayMock),
}))
jest.mock('../../../utils/contract')

const confirmPaymentMock = jest.fn(() => [{}, null])
jest.mock('../../../utils/peachAPI/private/contract/confirmPayment', () => ({
  confirmPayment: jest.fn(() => confirmPaymentMock()),
}))

const signReleaseTxOfContractMock = jest.fn((..._args: any) => ['tx', null])
jest.mock('../../../utils/contract/signReleaseTxOfContract', () => ({
  signReleaseTxOfContract: jest.fn((...args: any) => signReleaseTxOfContractMock(...args)),
}))

const DATE_TO_USE = new Date('2009-09-01')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)

describe('useReleaseEscrow', () => {
  const contract = {} as Contract

  it('should show the loading overlay', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(showLoadingOverlayMock).toHaveBeenCalledWith({
      title: i18n('dispute.lost'),
      level: 'WARN',
    })
  })

  it('should sign the release transaction', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(signReleaseTxOfContract).toHaveBeenCalledWith(contract)
  })

  it('should close the overlay and show an error if the transaction could not be signed', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    signReleaseTxOfContractMock.mockReturnValueOnce([null, 'error'])
    await result.current()
    expect(updateOverlayMock).toHaveBeenCalled()
    expect(showErrorMock).toHaveBeenCalledWith('error')
  })

  it('should confirm the payment', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(confirmPayment).toHaveBeenCalledWith({ contractId: contract.id, releaseTransaction: 'tx' })
  })

  it('should close the overlay and show an error if the payment could not be confirmed', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    confirmPaymentMock.mockReturnValueOnce([null, { error: 'error' }])
    await result.current()
    expect(updateOverlayMock).toHaveBeenCalled()
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

  it('should close the overlay', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
  })
})
