import { renderHook } from '@testing-library/react-native'
import { Loading } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { useShowLoadingOverlay } from './useShowLoadingOverlay'
import { usePopupStore } from '../store/usePopupStore'

describe('useShowLoadingOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('returns function to show loading popup', () => {
    const { result } = renderHook(useShowLoadingOverlay)
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens default overlay with loading animation', () => {
    const { result } = renderHook(useShowLoadingOverlay)
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: { callback: expect.any(Function), icon: 'clock', label: i18n('loading') },
      content: <Loading color={tw`text-black-1`.color} style={tw`self-center`} />,
      level: 'APP',
      requireUserAction: true,
      title: i18n('loading'),
      visible: true,
    })
  })
  it('action callback does not close popup', () => {
    const { result } = renderHook(useShowLoadingOverlay)
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(true)
  })
  it('respects passed options', () => {
    const title = 'title'
    const level = 'WARN'
    const { result } = renderHook(useShowLoadingOverlay)
    result.current({
      title,
      level,
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: { callback: expect.any(Function), icon: 'clock', label: i18n('loading') },
      content: <Loading color={tw`text-black-1`.color} style={tw`self-center`} />,
      level,
      requireUserAction: true,
      title,
      visible: true,
    })
  })
})
