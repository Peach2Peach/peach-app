import { Keyboard } from 'react-native'
import { renderHook, waitFor } from 'test-utils'
import { contract } from '../../../../../tests/unit/data/contractData'
import { queryClient } from '../../../../../tests/unit/helpers/QueryClientWrapper'
import { usePopupStore } from '../../../../store/usePopupStore'
import { defaultAccount, setAccount } from '../../../../utils/account/account'
import { peachAPI } from '../../../../utils/peachAPI/peachAPI'
import { useSubmitDisputeAcknowledgement } from './useSubmitDisputeAcknowledgement'

const now = new Date()
jest.useFakeTimers({ now })

const showErrorBannerMock = jest.fn()
jest.mock('../../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
const showLoadingPopupMock = jest.fn()
jest.mock('../../../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: () => showLoadingPopupMock,
}))

jest.mock('../../../../utils/peachAPI/peachAPI')

const saveContractMock = jest.fn()
jest.mock('../../../../utils/contract/saveContract', () => ({
  saveContract: (...args: unknown[]) => saveContractMock(...args),
}))

describe('useSubmitDisputeAcknowledgement', () => {
  const acknowledgeDisputeMock = jest.spyOn(peachAPI.private.contract, 'acknowledgeDispute')

  beforeEach(() => {
    queryClient.setQueryData(['contract', contract.id], contract)
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('returns interface', () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('does nothing if email is required and invalid', async () => {
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
    result.current({ contractId: noPaymentContract.id, disputeReason, email: '' })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(showLoadingPopupMock).not.toHaveBeenCalled()
    expect(acknowledgeDisputeMock).not.toHaveBeenCalled()
  })

  it('saves contract for seller update when successful', async () => {
    setAccount({ ...defaultAccount, publicKey: contract.seller.id })
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
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
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
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
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
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
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
    result.current({ contractId: noPaymentContract.id, disputeReason, email: 'satoshi@bitcoin.org' })
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0)
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })

    expect(keyboardSpy).toHaveBeenCalled()
  })
  it('opens error banner if submit was not successful', async () => {
    const error = 'NOT_FOUND'
    acknowledgeDisputeMock.mockResolvedValueOnce({
      result: undefined,
      error: { error },
      isError: () => true,
      isOk: () => false,
      getValue: () => undefined,
      getError: () => ({
        error,
      }),
    })
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
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
    const { result } = renderHook(useSubmitDisputeAcknowledgement)
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
