import { renderHook } from '@testing-library/react-native'
import { Keyboard } from 'react-native'
import { contract } from '../../../../../tests/unit/data/contractData'
import { Loading } from '../../../../components'
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
  })

  it('returns interface', () => {
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    expect(result.current).toBeInstanceOf(Function)
  })

  it('does nothing if email is required and invalid', async () => {
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    result.current(noPaymentContract, disputeReason, '')

    expect(updateOverlayMock).not.toHaveBeenCalled()
    expect(acknowledgeDisputeMock).not.toHaveBeenCalled()
  })

  it('opens popup with loading animation', async () => {
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    result.current(contract, 'other', 'seller')

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: {
        callback: expect.any(Function),
        icon: 'clock',
        label: i18n('loading'),
      },
      content: (
        <Loading
          color="#2B1911"
          style={{
            alignSelf: 'center',
          }}
        />
      ),
      level: 'WARN',
      requireUserAction: true,
      title: i18n('dispute.opened'),
      visible: true,
    })
  })

  it('saves contract for seller update when successful', async () => {
    await setAccount({ ...defaultAccount, publicKey: contract.seller.id })
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    await result.current(contract, 'other', 'seller')
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      disputeDate: now,
      disputeAcknowledgedByCounterParty: true,
      disputeInitiator: contract.buyer.id,
    })
  })
  it('saves contract for buyer update when successful', async () => {
    await setAccount({ ...defaultAccount, publicKey: contract.buyer.id })
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    await result.current(contract, 'other', 'buyer')
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      disputeDate: now,
      disputeAcknowledgedByCounterParty: true,
      disputeInitiator: contract.seller.id,
    })
  })
  it('closes popup when successful', async () => {
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    await result.current(contract, 'other', 'seller')

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
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    await result.current(noPaymentContract, disputeReason, 'satoshi@bitcoin.org')

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
    const { result } = renderHook(() => useSubmitDisputeAcknowledgement())
    await result.current(noPaymentContract, disputeReason, 'satoshi@bitcoin.org')
    expect(showErrorBannerMock).toHaveBeenCalledWith(error)
  })
})
