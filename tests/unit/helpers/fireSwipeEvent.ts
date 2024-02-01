import { ReactTestInstance } from "react-test-renderer";
import { fireEvent } from "test-utils";

type Props = {
  element: ReactTestInstance;
  x?: number;
  y?: number;
};
export const fireSwipeEvent = ({ element, x = 0, y = 0 }: Props) => {
  const endTouch = {
    currentPageX: x,
    previousPageX: 0,
    currentPageY: y,
    previousPageY: 0,
    touchActive: true,
    currentTimeStamp: 1,
  };
  const moveEvent = {
    touchHistory: {
      touchBank: [endTouch],
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: 1,
    },
  };

  fireEvent(element, "onMoveShouldSetResponder");
  fireEvent(element, "onResponderMove", moveEvent);
  fireEvent(element, "onResponderRelease", {
    nativeEvent: {
      changedTouches: [endTouch],
      identifier: 1,
      locationX: x,
      locationY: y,
      pageX: x,
      pageY: y,
      target: 1,
      timestamp: 1,
      touches: [endTouch],
    },
  });
};

export const swipeRight = (element: Props["element"]) => {
  fireSwipeEvent({ element, x: 260 });
};
