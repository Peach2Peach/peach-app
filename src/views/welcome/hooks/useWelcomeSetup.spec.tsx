import { RefObject } from 'react'
import { ICarouselInstance } from 'react-native-reanimated-carousel'
import { act, renderHook } from 'test-utils'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useWelcomeSetup } from './useWelcomeSetup'

describe('useWelcomeSetup', () => {
  const carousel: RefObject<ICarouselInstance> = {
    current: {
      next: jest.fn(),
    } as unknown as ICarouselInstance,
  }
  const initialProps = { carousel: { current: null } }
  it('should set up header correctly', () => {
    renderHook(useWelcomeSetup, { initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('returns defaults', () => {
    const { result } = renderHook(useWelcomeSetup, { initialProps })
    expect(result.current).toEqual({
      endReached: false,
      progress: 0.2,
      goToEnd: expect.any(Function),
      next: expect.any(Function),
      page: 0,
      setPage: expect.any(Function),
    })
  })
  it('sets page', () => {
    const { result } = renderHook(useWelcomeSetup, { initialProps })
    act(() => {
      result.current.setPage(2)
    })
    expect(result.current.page).toEqual(2)
    expect(result.current.progress).toEqual(0.6)
  })
  it('should return endReached true if last page is reached', () => {
    const { result } = renderHook(useWelcomeSetup, { initialProps })
    act(() => {
      result.current.setPage(4)
    })
    expect(result.current.page).toEqual(4)
    expect(result.current.progress).toEqual(1)
    expect(result.current.endReached).toEqual(true)
  })
  it('should go to next', () => {
    const { result } = renderHook(useWelcomeSetup, {
      initialProps: { carousel: carousel as RefObject<ICarouselInstance> },
    })
    act(() => {
      result.current.next()
    })
    expect(carousel.current?.next).toHaveBeenCalled()
  })
  it('should go to end', () => {
    const { result } = renderHook(useWelcomeSetup, {
      initialProps: { carousel: carousel as RefObject<ICarouselInstance> },
    })
    act(() => {
      result.current.goToEnd()
    })
    expect(carousel.current?.next).toHaveBeenCalledWith({ count: 4 })
  })
})
