import { PAYMENTMETHODINFOS } from "../../paymentMethods";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";
import { dataMigrationAfterLoadingAccount } from "./dataMigrationAfterLoadingAccount";

jest.mock("./afterLoadingAccount/checkSupportedPaymentMethods");

describe("dataMigrationAfterLoadingAccount", () => {
  it("should call checkSupportedPaymentMethods", () => {
    dataMigrationAfterLoadingAccount();
    expect(checkSupportedPaymentMethods).toHaveBeenCalledWith(
      PAYMENTMETHODINFOS,
    );
  });
});
