import { fireEvent, render } from "test-utils";
import i18n from "../../../utils/i18n";
import { UndoButton } from "./UndoButton";

jest.useFakeTimers();

describe("UndoButton", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <UndoButton onPress={jest.fn()} onTimerFinished={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should call onPress when pressed", () => {
    const onPress = jest.fn();
    const { getAllByText } = render(
      <UndoButton onPress={onPress} onTimerFinished={jest.fn()} />,
    );
    const button = getAllByText(i18n("search.undo"))[0];
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalled();
  });
  it("should call onTimerFinished when timer is finished", () => {
    const onTimerFinished = jest.fn();
    render(
      <UndoButton onPress={jest.fn()} onTimerFinished={onTimerFinished} />,
    );
    jest.runAllTimers();
    expect(onTimerFinished).toHaveBeenCalled();
  });
});
