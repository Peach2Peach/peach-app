import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { Loading } from '../components'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useStartRefundPopup } from './useStartRefundPopup'

const refundEscrowMock = jest.fn()
jest.mock('../hooks/useRefundEscrow', () => ({
  useRefundEscrow: () => refundEscrowMock,
}))

const psbt = 'psbt'
const getRefundPSBTMock = jest.fn().mockResolvedValue([{ psbt }, null])
jest.mock('../utils/peachAPI', () => ({
  getRefundPSBT: (...args: any) => getRefundPSBTMock(...args),
}))

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('useStartRefundPopup', () => {
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return a function', () => {
    const { result } = renderHook(useStartRefundPopup, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading popup and start refund', async () => {
    const { result } = renderHook(useStartRefundPopup, { wrapper })
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
