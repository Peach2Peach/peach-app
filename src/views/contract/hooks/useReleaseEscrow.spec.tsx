import { useReleaseEscrow } from './useReleaseEscrow'
import { saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI/private/contract/confirmPayment'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'
import { renderHook } from '@testing-library/react-native'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { Loading } from '../../../components'
import tw from '../../../styles/tailwind'

const showErrorMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
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

  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should show the loading popup', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      content: <Loading color="#2B1911" style={tw`self-center`} />,
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
    signReleaseTxOfContractMock.mockReturnValueOnce([null, 'error'])
    await result.current()
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(showErrorMock).toHaveBeenCalledWith('error')
  })

  it('should confirm the payment', async () => {
    const { result } = renderHook(() => useReleaseEscrow(contract))
    await result.current()
    expect(confirmPayment).toHaveBeenCalledWith({ contractId: contract.id, releaseTransaction: 'tx' })
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
