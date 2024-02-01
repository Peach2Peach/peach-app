import { PAYMENTMETHODINFOS } from "../../paymentMethods";
import { dataMigrationAfterLoadingAccount } from "./dataMigrationAfterLoadingAccount";

const checkSupportedPaymentMethodsMock = jest.fn();
const checkUsedReferralCodeMock = jest.fn();
jest.mock("./afterLoadingAccount/checkSupportedPaymentMethods", () => ({
  checkSupportedPaymentMethods: (...args: unknown[]) =>
    checkSupportedPaymentMethodsMock(...args),
}));
jest.mock("./afterLoadingAccount/checkUsedReferralCode", () => ({
  checkUsedReferralCode: (...args: unknown[]) =>
    checkUsedReferralCodeMock(...args),
}));

describe("dataMigrationAfterLoadingAccount", () => {
  it("should call checkSupportedPaymentMethods", () => {
    dataMigrationAfterLoadingAccount();
    expect(checkSupportedPaymentMethodsMock).toHaveBeenCalledWith(
      PAYMENTMETHODINFOS,
    );
  });

  it("should call checkUsedReferralCode", () => {
    dataMigrationAfterLoadingAccount();
    expect(checkUsedReferralCodeMock).toHaveBeenCalled();
  });
});
