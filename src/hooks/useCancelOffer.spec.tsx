import { renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../tests/unit/data/accountData'
import { buyOffer } from '../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { CancelOffer } from '../popups/CancelOffer'
import { usePopupStore } from '../store/usePopupStore'
import { updateAccount } from '../utils/account'
import { useCancelOffer } from './useCancelOffer'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const cancelOfferMock = jest.fn().mockResolvedValue([{}, null])
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: () => cancelOfferMock(),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('useCancelOffer', () => {
  beforeEach(() => {
    updateAccount(account1)
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
      content: <CancelOffer type="bid" />,
      level: 'DEFAULT',
      title: 'cancel offer',
      visible: true,
    })
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelOffer, {
      wrapper,
      initialProps: buyOffer,
    })
    result.current()

    usePopupStore.getState().action1?.callback()

    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual({
        ...usePopupStore.getState(),
        title: 'offer canceled!',
        level: 'DEFAULT',
      })
    })
  })
})
