import { constructLiquidPSBT } from "../../../tests/unit/helpers/constructLiquidPSBT";
import { constructPSBT } from "../../../tests/unit/helpers/constructPSBT";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { txIdPartOfPSBT } from "./txIdPartOfPSBT";

describe("txIdPartOfPSBT", () => {
  const wallet = createTestWallet();
  const txIdThatIsPartOfPSBT =
    "d8a31704d33febfc8a4271c3f9d65b5d7679c5cab19f25058f2d7d2bc6e7b86c";
  it("returns true/false if tx is part (or not) of bitcoin psbt", () => {
    const psbt = constructPSBT(wallet);

    expect(txIdPartOfPSBT(txIdThatIsPartOfPSBT, psbt)).toBeTruthy();
    expect(txIdPartOfPSBT("othertxId", psbt)).toBeFalsy();
  });
  it("returns true/false if tx is part (or not) of liquid psbt", () => {
    const psbt = constructLiquidPSBT(wallet);
    expect(txIdPartOfPSBT(txIdThatIsPartOfPSBT, psbt)).toBeTruthy();
    expect(txIdPartOfPSBT("othertxId", psbt)).toBeFalsy();
  });
});
