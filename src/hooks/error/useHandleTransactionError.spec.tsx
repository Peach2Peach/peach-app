import { renderHook } from "test-utils";
import { transactionError } from "../../../tests/unit/data/errors";
import { useHandleTransactionError } from "./useHandleTransactionError";

const mockShowErrorBanner = jest.fn();
jest.mock("../useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

describe("useHandleTransactionError", () => {
  it("should return a function", () => {
    const { result } = renderHook(useHandleTransactionError);
    expect(result.current).toBeInstanceOf(Function);
  });

  it("should handle broadcast errors", () => {
    const { result } = renderHook(useHandleTransactionError);

    result.current(transactionError);
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "78999997952",
      "1089000",
    ]);
  });
});
