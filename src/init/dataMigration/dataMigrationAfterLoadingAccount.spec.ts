import { useConfigStore } from "../../store/configStore/configStore";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";
import { dataMigrationAfterLoadingAccount } from "./dataMigrationAfterLoadingAccount";

jest.mock("./afterLoadingAccount/checkSupportedPaymentMethods");

describe("dataMigrationAfterLoadingAccount", () => {
  it("should call checkSupportedPaymentMethods", async () => {
    await dataMigrationAfterLoadingAccount();
    expect(checkSupportedPaymentMethods).toHaveBeenCalledWith(
      useConfigStore.getState().paymentMethods,
    );
  });
});
