import { fireEvent, render } from "test-utils";
import { MSINAMINUTE, MSINANHOUR } from "../../constants";
import { TimerSummaryItem } from "./TimerSummaryItem";

const now = new Date("2022-03-08T11:41:07.245Z");
jest.useFakeTimers({ now });

describe("TimerSummaryItem", () => {
  const onPress = jest.fn();
  const end = Date.now() + MSINANHOUR + MSINAMINUTE + MSINAMINUTE / 2;
  it("action is triggered when pressed", () => {
    const { getByText } = render(
      <TimerSummaryItem
        title="rating"
        end={end}
        iconId="checkCircle"
        iconColor={"#BADA55"}
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText("01:01:30"));
    expect(onPress).toHaveBeenCalled();
  });
});
