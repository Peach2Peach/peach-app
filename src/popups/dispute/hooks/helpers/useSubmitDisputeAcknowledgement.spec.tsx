import { renderHook, waitFor } from '@testing-library/react-native'
import { Keyboard } from 'react-native'
import { contract } from '../../../../../tests/unit/data/contractData'
import { NavigationAndQueryClientWrapper } from '../../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../../../tests/unit/helpers/QueryClientWrapper'
import { usePopupStore } from '../../../../store/usePopupStore'
import { defaultAccount, setAccount } from '../../../../utils/account/account'
import { useSubmitDisputeAcknowledgement } from './useSubmitDisputeAcknowledgement'

const now = new Date()
jest.useFakeTimers({ now })

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))
const showLoadingPopupMock = jest.fn()
const useShowLoadingPopupMock = jest.fn().mockReturnValue(showLoadingPopupMock)
jest.mock('../../../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: () => useShowLoadingPopupMock(),
}))

const acknowledgeDisputeMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../../../utils/peachAPI/private/contract', () => ({
  acknowledgeDispute: (...args: unknown[]) => acknowledgeDisputeMock(...args),
}))

const saveContractMock = jest.fn()
jest.mock('../../../../utils/contract/saveContract', () => ({
  saveContract: (...args: unknown[]) => saveContractMock(...args),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('useSubmitDisputeAcknowledgement', () => {
  beforeEach(() => {
    queryClient.setQueryData(['contract', contract.id], contract)
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('returns interface', () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('does nothing if email is required and invalid', async () => {
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: noPaymentContract.id, disputeReason, email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(showLoadingPopupMock).not.toHaveBeenCalled()
    expect(acknowledgeDisputeMock).not.toHaveBeenCalled()
  })

  it('saves contract for seller update when successful', async () => {
    setAccount({ ...defaultAccount, publicKey: contract.seller.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: contract.id, disputeReason: 'other', email: '' })

    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      isEmailRequired: false,
    })
  })
  it('saves contract for buyer update when successful', async () => {
    setAccount({ ...defaultAccount, publicKey: contract.buyer.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: contract.id, disputeReason: 'other', email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      isEmailRequired: false,
    })
  })
  it('closes popup when successful', async () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: contract.id, disputeReason: 'other', email: 'seller@mail.com' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('closes keyboard when successful and email was required', async () => {
    const keyboardSpy = jest.spyOn(Keyboard, 'dismiss')
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: noPaymentContract.id, disputeReason, email: 'satoshi@bitcoin.org' })
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
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: noPaymentContract.id, disputeReason, email: 'satoshi@bitcoin.org' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    expect(showErrorBannerMock).toHaveBeenCalledWith(error)
  })
  it('updates the isEmailRequired property on the contract', async () => {
    queryClient.setQueryData(['contract', contract.id], { ...contract, isEmailRequired: true })
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime())

    setAccount({ ...defaultAccount, publicKey: contract.buyer.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement, { wrapper })
    result.current({ contractId: contract.id, disputeReason: 'other', email: '' })

    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0)
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(queryClient.getQueryData(['contract', contract.id])).toEqual({
      ...contract,
      isEmailRequired: false,
    })
  })
})
