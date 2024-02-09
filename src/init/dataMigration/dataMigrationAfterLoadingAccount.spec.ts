import { PAYMENTMETHODINFOS } from "../../paymentMethods";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";
import { checkUsedReferralCode } from "./afterLoadingAccount/checkUsedReferralCode";
import { dataMigrationAfterLoadingAccount } from "./dataMigrationAfterLoadingAccount";

jest.mock("./afterLoadingAccount/checkSupportedPaymentMethods");
jest.mock("./afterLoadingAccount/checkUsedReferralCode");

describe("dataMigrationAfterLoadingAccount", () => {
  it("should call checkSupportedPaymentMethods", () => {
    dataMigrationAfterLoadingAccount();
    expect(checkSupportedPaymentMethods).toHaveBeenCalledWith(
      PAYMENTMETHODINFOS,
    );
  });

  it("should call checkUsedReferralCode", () => {
    dataMigrationAfterLoadingAccount();
    expect(checkUsedReferralCode).toHaveBeenCalled();
  });
});
