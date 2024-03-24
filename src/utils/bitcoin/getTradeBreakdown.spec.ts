import { networks } from "bitcoinjs-lib";
import { isValidReleaseTransaction } from "../../../tests/unit/data/bitcoinNetworkData";
import { validLiquidReleaseTransactionLiquid } from "../../../tests/unit/data/liquidNetworkData";
import { getTradeBreakdown } from "./getTradeBreakdown";

jest.mock("../wallet/getNetwork");
jest
  .requireMock("../wallet/getNetwork")
  .getNetwork.mockReturnValue(networks.bitcoin);

describe("getTradeBreakdown", () => {
  const inputAmount = 1000000;
  const releaseTransaction = isValidReleaseTransaction;
  const releaseAddress = "bc1qjpq8uus03kr9kch2er3vvt34t9fxfrqz32e24w";

  it("should handle no release output", () => {
    expect(
      getTradeBreakdown({
        releaseTransaction,
        releaseAddress: "otherAddress",
        inputAmount,
      }),
    ).toEqual({
      totalAmount: 0,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 0,
    });
  });

  it("should handle no peach fee output", () => {
    const releaseTxNoOutput =
      "0200000000010172c32d933343a2c28079c0e010c28d603fd1a9a95a006a94fa788ff96a582ecf0000000000e010000001683e0f0000000000160014d655ec44e12e00ff0658684b3f31236e9f653a5103483045022100f454665418fee7d26fcc19267fc35720066198c7833f88e0486dfe7adc2739ed022044b0712cd860135f08e7e0ca42ae89a4cc36ed969cc7843311828b2a297263cb0101014e6302e010b275672102e82ecc3ab700832d5ac61624078b72307c9b7d7906d4790eea868bb167808fddad6821030651dbc76782c0eb134a0e10123908135d3fe0697ab43b67559209c4239f53bfac00000000";
    expect(
      getTradeBreakdown({
        releaseTransaction: releaseTxNoOutput,
        releaseAddress: "bc1q6e27c38p9cq07pjcdp9n7vfrd60k2wj3uqhv8d",
        inputAmount,
      }),
    ).toEqual({
      amountReceived: 999016,
      networkFee: 984,
      peachFee: 0,
      totalAmount: inputAmount,
    });
  });

  it("should return correct breakdown", () => {
    expect(
      getTradeBreakdown({ releaseTransaction, releaseAddress, inputAmount }),
    ).toEqual({
      amountReceived: 983624,
      networkFee: 1376,
      peachFee: 15000,
      totalAmount: inputAmount,
    });
  });
  it("should return correct breakdown for liquid tx", () => {
    expect(
      getTradeBreakdown({
        releaseTransaction: validLiquidReleaseTransactionLiquid,
        releaseAddress: "ex1qjpq8uus03kr9kch2er3vvt34t9fxfrqzmryjcw",
        inputAmount,
      }),
    ).toEqual({
      amountReceived: 983040,
      networkFee: 1960,
      peachFee: 15000,
      totalAmount: inputAmount,
    });
  });

  it("should handle error", () => {
    expect(
      getTradeBreakdown({
        releaseTransaction: "garbage",
        releaseAddress,
        inputAmount,
      }),
    ).toEqual({
      totalAmount: 0,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 0,
    });
  });
});
