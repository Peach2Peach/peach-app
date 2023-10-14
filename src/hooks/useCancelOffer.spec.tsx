import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { account1 } from '../../tests/unit/data/accountData'
import { buyOffer } from '../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/CustomWrapper'
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

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { toJSON } = render(popupComponent, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelOffer, {
      wrapper,
      initialProps: buyOffer,
    })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent, { wrapper })
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual({
        ...usePopupStore.getState(),
        title: 'offer canceled!',
        level: 'DEFAULT',
      })
    })
  })
})
