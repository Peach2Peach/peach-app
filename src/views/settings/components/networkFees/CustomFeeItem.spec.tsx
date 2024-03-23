import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render } from "test-utils";
import { CustomFeeItem } from "./CustomFeeItem";
expect.extend({ toMatchDiffSnapshot });

describe("CustomFeeItem", () => {
  const customFeeRate = "4";
  const chain = "bitcoin";
  const setCustomFeeRate = jest.fn();
  const defaultComponent = (
    <CustomFeeItem {...{ chain, customFeeRate, setCustomFeeRate }} />
  );
  const base = render(defaultComponent).toJSON();
  it("renders correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("renders correctly for liquid", () => {
    const { toJSON } = render(
      <CustomFeeItem
        {...{ chain: "liquid", customFeeRate, setCustomFeeRate }}
      />,
    );
    expect(base).toMatchDiffSnapshot(toJSON());
  });
  it("renders correctly when disabled", () => {
    const { toJSON } = render(
      <CustomFeeItem
        {...{ chain, customFeeRate, setCustomFeeRate, disabled: true }}
      />,
    );
    expect(base).toMatchDiffSnapshot(toJSON());
  });

  it("sets custom fee rate", () => {
    const { getByTestId } = render(defaultComponent);
    const input = getByTestId("input-custom-fees");
    act(() => {
      fireEvent.changeText(input, "60.23");
    });
    expect(setCustomFeeRate).toHaveBeenCalledWith("60.23");
  });
});
