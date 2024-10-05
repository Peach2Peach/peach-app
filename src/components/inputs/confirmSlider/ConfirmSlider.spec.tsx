import { render } from "test-utils";
import { fireSwipeEvent } from "../../../../tests/unit/helpers/fireSwipeEvent";
import { ConfirmSlider } from "./ConfirmSlider";

describe("ConfirmSlider", () => {
  const onConfirm = jest.fn();

  it("calls onConfirm on swipe to end", () => {
    const { getByTestId } = render(
      <ConfirmSlider label1="label1" onConfirm={onConfirm} />,
    );
    fireSwipeEvent({ element: getByTestId("confirmSlider"), x: 260 });
    expect(onConfirm).toHaveBeenCalled();
  });
  it("does not call onConfirm on incomplete swipe", () => {
    const { getByTestId } = render(
      <ConfirmSlider label1="label1" onConfirm={onConfirm} />,
    );
    fireSwipeEvent({ element: getByTestId("confirmSlider"), x: 183 });
    expect(onConfirm).not.toHaveBeenCalled();
  });
  it("does not call onConfirm on swipe to end if not enabled", () => {
    const { getByTestId } = render(
      <ConfirmSlider label1="label1" onConfirm={onConfirm} enabled={false} />,
    );
    fireSwipeEvent({ element: getByTestId("confirmSlider"), x: 260 });
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
