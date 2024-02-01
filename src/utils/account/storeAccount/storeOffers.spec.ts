import * as accountData from "../../../../tests/unit/data/accountData";
import * as offerData from "../../../../tests/unit/data/offerData";
import { defaultAccount, setAccount } from "../account";
import { offerStorage } from "../offerStorage";
import { storeOffers } from "./storeOffers";

describe("storeOffers", () => {
  beforeEach(async () => {
    setAccount(defaultAccount);
    await storeOffers(defaultAccount.offers);
  });

  it("would write file to store offers", async () => {
    await storeOffers(accountData.account1.offers);
    expect(offerStorage.setMapAsync).toHaveBeenCalledWith(
      "37",
      offerData.buyOffer,
    );
    expect(offerStorage.setMapAsync).toHaveBeenCalledWith(
      "38",
      offerData.sellOffer,
    );
  });
});
