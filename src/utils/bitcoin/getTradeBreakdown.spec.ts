import { getTradeBreakdown } from "./getTradeBreakdown";

jest.mock("bitcoinjs-lib", () => ({
  ...jest.requireActual("bitcoinjs-lib"),
  Transaction: {
    fromHex: jest.fn(),
  },
  address: {
    fromOutputScript: jest.fn((script) =>
      script === "peach" ? "peach" : "releaseAddress",
    ),
  },
}));

const fromHexMock = jest.requireMock("bitcoinjs-lib").Transaction.fromHex;

jest.mock("../wallet/getNetwork", () => ({
  getNetwork: jest.fn().mockReturnValue("regtest"),
}));

describe("getTradeBreakdown", () => {
  const releaseTransaction = "releaseTransaction";
  const releaseAddress = "releaseAddress";
  it("should handle no release output", () => {
    const inputAmount = 100;
    const virtualSize = 171;
    fromHexMock.mockReturnValue({ virtualSize: () => virtualSize, outs: [] });
    expect(
      getTradeBreakdown({ releaseTransaction, releaseAddress, inputAmount }),
    ).toEqual({
      totalAmount: 0,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 0,
    });
  });

  it("should handle no peach fee output", () => {
    const inputAmount = 100;
    const virtualSize = 171;
    fromHexMock.mockReturnValue({
      virtualSize: () => virtualSize,
      outs: [{ script: "script", value: 100 }],
    });
    expect(
      getTradeBreakdown({ releaseTransaction, releaseAddress, inputAmount }),
    ).toEqual({
      totalAmount: 100,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 100,
    });
  });

  it("should return correct breakdown", () => {
    const inputAmount = 120;
    const virtualSize = 171;
    fromHexMock.mockReturnValue({
      virtualSize: () => virtualSize,
      outs: [
        { script: "peach", value: 10 },
        { script: "releaseAddress", value: 100 },
      ],
    });
    expect(
      getTradeBreakdown({ releaseTransaction, releaseAddress, inputAmount }),
    ).toEqual({
      totalAmount: 120,
      peachFee: 10,
      networkFee: 10,
      amountReceived: 100,
    });
  });

  it("should handle error", () => {
    const inputAmount = 120;
    fromHexMock.mockImplementation(() => {
      throw new Error("error");
    });
    expect(
      getTradeBreakdown({ releaseTransaction, releaseAddress, inputAmount }),
    ).toEqual({
      totalAmount: 0,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 0,
    });
  });
});
