import { contract } from "../../../peach-api/src/testData/contract";
import { logTradeCompleted } from "./logTradeCompleted";

jest.mock("@react-native-firebase/analytics");

describe("logTradeCompleted", () => {
  it("should call analytics event", () => {
    const logEventMock = jest.fn();
    jest
      .spyOn(jest.requireMock("@react-native-firebase/analytics"), "default")
      .mockReturnValue({
        logEvent: logEventMock,
      });

    logTradeCompleted(contract);
    expect(logEventMock).toHaveBeenCalledWith("trade_completed", {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    });
  });
});
