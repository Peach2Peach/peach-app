import { renderHook } from '@testing-library/react-native'
import { buyOffer } from '../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../tests/unit/helpers/QueryClientWrapper'
import { CancelOffer } from '../popups/CancelOffer'
import { usePopupStore } from '../store/usePopupStore'
import { useCancelOffer } from './useCancelOffer'
import { updateAccount } from '../utils/account'
import { account1 } from '../../tests/unit/data/accountData'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: any[]) => saveOfferMock(...args),
}))

const cancelOfferMock = jest.fn().mockResolvedValue([{}, null])
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: () => cancelOfferMock(),
}))

const wrapper = ({ children }: { children: JSX.Element }) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

describe('useCancelOffer', () => {
  beforeEach(() => {
    updateAccount(account1)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should show cancel offer popup', () => {
    const { result } = renderHook(useCancelOffer, {
      wrapper,
      initialProps: buyOffer,
    })
    result.current()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'cancel offer',
      },
      action2: {
        callback: usePopupStore.getState().closePopup,
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <CancelOffer offer={buyOffer} />,
      level: 'DEFAULT',
      title: 'cancel offer',
      visible: true,
    })
  })

  it('should show cancel offer confirmation popup', () => {
    const { result } = renderHook(useCancelOffer, {
      wrapper,
      initialProps: buyOffer,
    })
    result.current()

    usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'offer canceled!',
      level: 'DEFAULT',
    })
  })
})
