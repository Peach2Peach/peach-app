import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "./PeachLiquidJSWallet";
import { PeachWallet } from "./PeachWallet";
import { getWallet } from "./getWallet";
import {
  peachLiquidWallet,
  peachWallet,
  setLiquidWallet,
  setPeachWallet,
  setWallet,
} from "./setWallet";

describe("setWallet", () => {
  it("sets wallet", () => {
    const recoveredWallet = createTestWallet();
    setWallet(recoveredWallet);

    expect(getWallet()).toStrictEqual(recoveredWallet);
  });
});

describe("setPeachWallet", () => {
  it("sets peach wallet", () => {
    const newPeachWallet = new PeachWallet({ wallet: createTestWallet() });
    setPeachWallet(newPeachWallet);

    expect(peachWallet).toStrictEqual(newPeachWallet);
  });
});
describe("setLiquidWallet", () => {
  it("sets peach liquid wallet", () => {
    const newLiquidPeachWallet = new PeachLiquidJSWallet({
      wallet: createTestWallet(),
    });
    setLiquidWallet(newLiquidPeachWallet);

    expect(peachLiquidWallet).toStrictEqual(newLiquidPeachWallet);
  });
});
