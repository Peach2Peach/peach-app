import { fireEvent, render, renderHook } from 'test-utils'
import { Popup } from '../../../components/popup'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { ErrorPopup } from '../../ErrorPopup'
import { ClosePopupAction } from '../../actions/ClosePopupAction'
import { DisputeRaisedSuccess } from '../components/DisputeRaisedSuccess'
import { useDisputeRaisedSuccess } from './useDisputeRaisedSuccess'

describe('useDisputeRaisedSuccess', () => {
  it('opens dispute raised success popup for buyer', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('buyer')

    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <ErrorPopup
        title="dispute opened"
        content={<DisputeRaisedSuccess view="buyer" />}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
  it('opens dispute raised success popup for seller', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('seller')

    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <ErrorPopup
        title="dispute opened"
        content={<DisputeRaisedSuccess view="seller" />}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
  it('closes popup', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('seller')
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('close'))
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
