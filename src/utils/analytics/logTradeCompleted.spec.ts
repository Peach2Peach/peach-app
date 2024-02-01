import { contract } from "../../../peach-api/src/testData/contract";
import { logTradeCompleted } from "./logTradeCompleted";

const logEventMock = jest.fn();
jest.mock("@react-native-firebase/analytics", () => () => ({
  logEvent: (...args: unknown[]) => logEventMock(...args),
}));

describe("logTradeCompleted", () => {
  it("should call analytics event", () => {
    logTradeCompleted(contract);
    expect(logEventMock).toHaveBeenCalledWith("trade_completed", {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    });
  });
});
