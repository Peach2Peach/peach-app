import { Animated } from 'react-native'
import { createPanResponder } from './createPanResponder'

describe('createPanResponder', () => {
  const mockNativeEvent = {
    changedTouches: [],
    identifier: '1',
    locationX: 0,
    locationY: 0,
    pageX: 0,
    pageY: 0,
    target: '1',
    timestamp: 0,
    touches: [],
  }
  const mockGestureResponderEvent = {
    nativeEvent: mockNativeEvent,
    bubbles: false,
    cancelable: false,
    currentTarget: 0,
    defaultPrevented: false,
    eventPhase: 0,
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    isTrusted: false,
    persist: jest.fn(),
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: 0,
    timeStamp: 0,
    type: '',
    touchHistory: { touchBank: [], numberActiveTouches: 0, indexOfSingleActiveTouch: 0 },
  }
  it('should return something', () => {
    const pan = new Animated.Value(0)
    const panResponder = createPanResponder(pan)
    expect(panResponder).toBeDefined()
  })

  it('should set the responder on move', () => {
    const pan = new Animated.Value(0)
    const panResponder = createPanResponder(pan)
    const shouldSetResponder = panResponder.panHandlers.onMoveShouldSetResponder?.(mockGestureResponderEvent)
    expect(shouldSetResponder).toBe(true)
  })

  it('should call Animated.event on move', () => {
    const pan = new Animated.Value(0)
    const panResponder = createPanResponder(pan)
    const eventSpy = jest.spyOn(Animated, 'event')
    panResponder.panHandlers.onResponderMove?.(mockGestureResponderEvent)
    expect(eventSpy).toHaveBeenCalledWith([null, { dy: pan }], { useNativeDriver: false })
  })

  it('should call pan.extractOffset on release', () => {
    const pan = new Animated.Value(0)
    const panResponder = createPanResponder(pan)
    const extractOffsetSpy = jest.spyOn(pan, 'extractOffset')
    panResponder.panHandlers.onResponderRelease?.(mockGestureResponderEvent)
    expect(extractOffsetSpy).toHaveBeenCalled()
  })

  it('should set the responder on grant', () => {
    const pan = new Animated.Value(0)
    const panResponder = createPanResponder(pan)
    const shouldSetResponder = panResponder.panHandlers.onResponderGrant?.(mockGestureResponderEvent)
    expect(shouldSetResponder).toBe(true)
  })
})
