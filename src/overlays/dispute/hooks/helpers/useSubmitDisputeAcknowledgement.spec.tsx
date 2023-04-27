import { renderHook, waitFor } from '@testing-library/react-native'
import { Keyboard } from 'react-native'
import { contract } from '../../../../../tests/unit/data/contractData'
import { queryClient, QueryClientWrapper } from '../../../../../tests/unit/helpers/QueryClientWrapper'
import { defaultAccount, setAccount } from '../../../../utils/account/account'
import i18n from '../../../../utils/i18n'
import { useSubmitDisputeAcknowledgement } from './useSubmitDisputeAcknowledgement'

const now = new Date()
jest.useFakeTimers({
  now,
})

const navigateMock = jest.fn()
const replaceMock = jest.fn()
jest.mock('../../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: () => navigateMock(),
    replace: (...args: any[]) => replaceMock(...args),
  }),
}))

const updateOverlayMock = jest.fn()
const useOverlayContextMock = jest.fn().mockReturnValue([, updateOverlayMock])
jest.mock('../../../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))
const showLoadingOverlayMock = jest.fn()
const useShowLoadingOverlayMock = jest.fn().mockReturnValue(showLoadingOverlayMock)
jest.mock('../../../../hooks/useShowLoadingOverlay', () => ({
  useShowLoadingOverlay: () => useShowLoadingOverlayMock(),
}))

const acknowledgeDisputeMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../../../utils/peachAPI/private/contract', () => ({
  acknowledgeDispute: (...args: any[]) => acknowledgeDisputeMock(...args),
}))

const saveContractMock = jest.fn()
jest.mock('../../../../utils/contract/saveContract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))

describe('useSubmitDisputeAcknowledgement', () => {
  afterEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  beforeEach(() => {
    queryClient.setQueryData(['contract', contract.id], contract)
  })

  it('returns interface', () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('does nothing if email is required and invalid', async () => {
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: noPaymentContract.id, disputeReason, email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(showLoadingOverlayMock).not.toHaveBeenCalled()
    expect(acknowledgeDisputeMock).not.toHaveBeenCalled()
  })

  it('opens popup with loading animation', async () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: contract.id, disputeReason: 'other', email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(showLoadingOverlayMock).toHaveBeenCalledWith({
      level: 'WARN',
      title: i18n('dispute.opened'),
    })
  })

  it('saves contract for seller update when successful', async () => {
    await setAccount({ ...defaultAccount, publicKey: contract.seller.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: contract.id, disputeReason: 'other', email: '' })

    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      isEmailRequired: false,
      disputeDate: now,
      disputeAcknowledgedByCounterParty: true,
      disputeInitiator: contract.buyer.id,
    })
  })
  it('saves contract for buyer update when successful', async () => {
    await setAccount({ ...defaultAccount, publicKey: contract.buyer.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: contract.id, disputeReason: 'other', email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      isEmailRequired: false,
      disputeDate: now,
      disputeAcknowledgedByCounterParty: true,
      disputeInitiator: contract.seller.id,
    })
  })
  it('closes popup when successful', async () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: contract.id, disputeReason: 'other', email: 'seller@mail.com' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(updateOverlayMock).toHaveBeenCalledWith({
      visible: false,
    })
  })
  it('closes keyboard when successful and email was required', async () => {
    const keyboardSpy = jest.spyOn(Keyboard, 'dismiss')
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: noPaymentContract.id, disputeReason, email: 'satoshi@bitcoin.org' })
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0)
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(keyboardSpy).toHaveBeenCalled()
  })
  it('opens error banner if submit was not successful', async () => {
    const error = 'TEST_ERROR'
    acknowledgeDisputeMock.mockResolvedValueOnce([null, { error }])
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: noPaymentContract.id, disputeReason, email: 'satoshi@bitcoin.org' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(showErrorBannerMock).toHaveBeenCalledWith(error)
  })
  it('updates the isEmailRequired property on the contract', async () => {
    queryClient.setQueryData(['contract', contract.id], { ...contract, isEmailRequired: true })
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime())

    await setAccount({ ...defaultAccount, publicKey: contract.buyer.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper: QueryClientWrapper })
    await result.current({ contractId: contract.id, disputeReason: 'other', email: '' })

    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0)
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(queryClient.getQueryData(['contract', contract.id])).toEqual({
      ...contract,
      isEmailRequired: false,
      disputeDate: now,
      disputeAcknowledgedByCounterParty: true,
      disputeInitiator: contract.seller.id,
    })
  })
})
