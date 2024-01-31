import * as accountData from "../../../../tests/unit/data/accountData";
import { accountStorage } from "../accountStorage";
import { storeTradingLimit } from "./storeTradingLimit";

describe("storeTradingLimit", () => {
  it("would write file to store tradingLimit", () => {
    storeTradingLimit(accountData.account1.tradingLimit);
    expect(accountStorage.setMap).toHaveBeenCalledWith(
      "tradingLimit",
      accountData.account1.tradingLimit,
    );
  });
});
