import { act, renderHook } from '@testing-library/react-native'
import { RefObject } from 'react'
import Carousel from 'react-native-snap-carousel'
import { NavigationWrapper, headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useWelcomeSetup } from './useWelcomeSetup'

const wrapper = NavigationWrapper
type CarouselType = Carousel<() => JSX.Element>

describe('useWelcomeSetup', () => {
  const carousel: RefObject<CarouselType> = {
    current: {
      snapToNext: jest.fn(),
      snapToItem: jest.fn(),
    } as unknown as CarouselType,
  }
  const initialProps = { carousel: { current: null } }
  it('should set up header correctly', () => {
    renderHook(useWelcomeSetup, { wrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('returns defaults', () => {
    const { result } = renderHook(useWelcomeSetup, { wrapper, initialProps })
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
    const { result } = renderHook(useWelcomeSetup, { wrapper, initialProps })
    act(() => {
      result.current.setPage(2)
    })
    expect(result.current.page).toEqual(2)
    expect(result.current.progress).toEqual(0.6)
  })
  it('should return endReached true if last page is reached', () => {
    const { result } = renderHook(useWelcomeSetup, { wrapper, initialProps })
    act(() => {
      result.current.setPage(4)
    })
    expect(result.current.page).toEqual(4)
    expect(result.current.progress).toEqual(1)
    expect(result.current.endReached).toEqual(true)
  })
  it('should go to next', () => {
    const { result } = renderHook(useWelcomeSetup, {
      wrapper,
      initialProps: { carousel: carousel as RefObject<CarouselType> },
    })
    act(() => {
      result.current.next()
    })
    expect(carousel.current?.snapToNext).toHaveBeenCalled()
  })
  it('should go to end', () => {
    const { result } = renderHook(useWelcomeSetup, {
      wrapper,
      initialProps: { carousel: carousel as RefObject<CarouselType> },
    })
    act(() => {
      result.current.goToEnd()
    })
    expect(carousel.current?.snapToItem).toHaveBeenCalledWith(4)
  })
})
