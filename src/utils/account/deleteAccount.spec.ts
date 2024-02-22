import * as accountData from "../../../tests/unit/data/accountData";
import { offerPreferencesStorage } from "../../store/offerPreferenes/useOfferPreferences";
import { settingsStorage } from "../../store/settingsStore/settingsStorage";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { peachAPI } from "../peachAPI";
import { setAccount } from "./account";
import { accountStorage } from "./accountStorage";
import { chatStorage } from "./chatStorage";
import { deleteAccount } from "./deleteAccount";

describe("deleteAccount", () => {
  beforeAll(() => {
    setAccount(accountData.account1);
  });

  it("would delete account file", () => {
    const usePaymentDataStoreReset = jest.spyOn(
      usePaymentDataStore.getState(),
      "reset",
    );
    deleteAccount();

    expect(accountStorage.clearStore).toHaveBeenCalled();
    expect(chatStorage.clearStore).toHaveBeenCalled();
    expect(settingsStorage.clearStore).toHaveBeenCalled();
    expect(offerPreferencesStorage.clearStore).toHaveBeenCalled();
    expect(usePaymentDataStoreReset).toHaveBeenCalled();
    expect(peachAPI.apiOptions.peachAccount).toBeNull();
  });
});
