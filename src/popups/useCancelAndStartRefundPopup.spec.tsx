import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../tests/unit/helpers/QueryClientWrapper'
import { Loading } from '../components'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useCancelAndStartRefundPopup } from './useCancelAndStartRefundPopup'

const refundEscrowMock = jest.fn()
jest.mock('../hooks/useRefundEscrow', () => ({
  useRefundEscrow: () => refundEscrowMock,
}))

const psbt = 'psbt'
const cancelOfferMock = jest.fn().mockResolvedValue([{ psbt }, null])
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: (...args: any) => cancelOfferMock(...args),
}))

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
}))

const wrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

describe('useCancelAndStartRefundPopup', () => {
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return a function', () => {
    const { result } = renderHook(useCancelAndStartRefundPopup, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading popup and start refund', async () => {
    const { result } = renderHook(useCancelAndStartRefundPopup, { wrapper })
    await result.current(sellOffer)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'refunding escrow',
      content: (
        <Loading
          color="#2B1911"
          style={{
            alignSelf: 'center',
          }}
        />
      ),
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })
    expect(refundEscrowMock).toHaveBeenCalledWith(sellOffer, psbt)
  })
})
