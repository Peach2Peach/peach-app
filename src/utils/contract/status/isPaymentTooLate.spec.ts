import { contract } from "../../../../peach-api/src/testData/contract";
import { isPaymentTooLate } from "./isPaymentTooLate";
describe("isPaymentTooLate", () => {
  const mockDate = 100;
  jest.spyOn(Date, "now").mockReturnValue(mockDate);
  const mockContract = {
    ...contract,
    paymentMade: null,
  };
  it("should return false if paymentMade is null", () => {
    expect(
      isPaymentTooLate({
        ...mockContract,
        paymentMade: new Date(mockDate - 1),
      }),
    ).toEqual(false);
  });
  it("should return false if paymentExpectedBy is greater than Date.now", () => {
    expect(
      isPaymentTooLate({
        ...mockContract,
        paymentExpectedBy: new Date(mockDate + 1),
      }),
    ).toEqual(false);
  });
  it("should return true if paymentExpectedBy is less than Date.now", () => {
    expect(
      isPaymentTooLate({
        ...mockContract,
        paymentExpectedBy: new Date(mockDate - 1),
      }),
    ).toEqual(true);
  });
});
