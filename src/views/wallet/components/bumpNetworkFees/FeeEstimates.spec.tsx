import { fireEvent, render } from "test-utils";
import { FeeEstimates } from "./FeeEstimates";

describe("FeeEstimates", () => {
  const setFeeMock = jest.fn();
  const estimatedFees = {
    fastestFee: 10,
    halfHourFee: 7,
    hourFee: 3,
    economyFee: 1,
    minimumFee: 1,
  };
  it("sets fees on press", () => {
    const { getByText } = render(
      <FeeEstimates estimatedFees={estimatedFees} setFeeRate={setFeeMock} />,
    );
    fireEvent(getByText("next block"), "onPress");
    expect(setFeeMock).toHaveBeenCalledWith("10");
    fireEvent(getByText("~ 30 min"), "onPress");
    expect(setFeeMock).toHaveBeenCalledWith("7");
    fireEvent(getByText("~ 1 hour"), "onPress");
    expect(setFeeMock).toHaveBeenCalledWith("3");
  });
});
