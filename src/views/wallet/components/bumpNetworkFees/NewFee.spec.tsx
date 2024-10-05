import { fireEvent, render } from "test-utils";
import { NewFee } from "./NewFee";

describe("NewFee", () => {
  const setNewFeeRateMock = jest.fn();
  it("sets new fee", () => {
    const newFee = "2";
    const { getByPlaceholderText } = render(
      <NewFee newFeeRate="1" setNewFeeRate={setNewFeeRateMock} />,
    );
    fireEvent(getByPlaceholderText(""), "onChangeText", newFee);
    expect(setNewFeeRateMock).toHaveBeenCalledWith(newFee);
  });
});
