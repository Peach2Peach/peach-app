import { fireEvent } from '@testing-library/react-native'
import { ReactTestInstance } from 'react-test-renderer'

type Props = {
  element: ReactTestInstance
  x?: number
  y?: number
}
export const fireSwipeEvent = ({ element, x = 0, y = 0 }: Props) => {
  const endTouch = {
    currentPageX: x,
    previousPageX: 0,
    currentPageY: y,
    previousPageY: 0,
    touchActive: true,
    currentTimeStamp: 1,
  }
  const moveEvent = {
    touchHistory: {
      touchBank: [endTouch],
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: 1,
    },
  }

  fireEvent(element, 'onMoveShouldSetResponder')
  fireEvent(element, 'onResponderMove', moveEvent)
  fireEvent(element, 'onResponderRelease')
}

export const swipeRight = (element: Props['element']) => {
  fireSwipeEvent({ element, x: 260 })
}
