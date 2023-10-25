import { renderHook } from 'test-utils'
import { usePopupStore } from '../../../store/usePopupStore'
import { DisputeRaisedSuccess } from '../components/DisputeRaisedSuccess'
import { useDisputeRaisedSuccess } from './useDisputeRaisedSuccess'

describe('useDisputeRaisedSuccess', () => {
  it('opens dispute raised success popup for buyer', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('buyer')

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'close',
      },
      content: <DisputeRaisedSuccess view="buyer" />,
      level: 'ERROR',
      title: 'dispute opened',
      visible: true,
    })
  })
  it('opens dispute raised success popup for seller', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('seller')

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'close',
      },
      content: <DisputeRaisedSuccess view="seller" />,
      level: 'ERROR',
      title: 'dispute opened',
      visible: true,
    })
  })
  it('closes popup', () => {
    const { result } = renderHook(useDisputeRaisedSuccess)
    result.current('seller')
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
