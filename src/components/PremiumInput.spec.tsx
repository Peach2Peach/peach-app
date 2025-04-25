import { fireEvent, render } from "test-utils";
import { round } from "../utils/math/round";
import { PremiumInput } from "./PremiumInput";

describe("PremiumInput", () => {
  const onChange = jest.fn();
  it("allows increasing and decreasing premium by 0.1", () => {
    const DEFAULT_PREMIUM = -3.2;
    const STEP = 0.1;
    const { getByAccessibilityHint } = render(
      <PremiumInput premium={DEFAULT_PREMIUM} setPremium={onChange} />,
    );
    fireEvent.press(getByAccessibilityHint("decrease number"));
    expect(onChange).toHaveBeenCalledWith(round(DEFAULT_PREMIUM - STEP, 2));
    fireEvent.press(getByAccessibilityHint("increase number"));
    expect(onChange).toHaveBeenCalledWith(round(DEFAULT_PREMIUM + STEP, 2));
  });
});
