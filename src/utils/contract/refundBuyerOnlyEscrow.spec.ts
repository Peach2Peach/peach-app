import { Psbt, networks, payments } from "bitcoinjs-lib";
import { peachAPI } from "../peachAPI";
import { signAndFinalizeEscrowPSBT } from "../wallet/signEscrowPSBT";
import { refundBuyerOnlyEscrow } from "./refundBuyerOnlyEscrow";

jest.mock("../peachAPI", () => ({
  peachAPI: {
    private: {
      contract: {
        getContract: jest.fn(),
        getBuyerOnlyEscrowRefundPsbt: jest.fn(),
        postBuyerOnlyEscrowRefund: jest.fn(),
      },
      offer: { getFundingStatus: jest.fn() },
    },
  },
}));
jest.mock("../../../peach-api", () => ({ ESCROW_VERSION: 2 }));
let mockPublicKey = "";
jest.mock("../account/account", () => ({
  useAccountStore: {
    getState: () => ({ account: { publicKey: mockPublicKey } }),
  },
}));
jest.mock("../wallet/getNetwork", () => ({
  getNetwork: () => jest.requireActual("bitcoinjs-lib").networks.regtest,
}));
jest.mock("./getBuyerOnlyEscrowWallet", () => ({
  getBuyerOnlyEscrowWallet: jest.fn(() => ({})),
}));
jest.mock("../wallet/signEscrowPSBT", () => ({
  signAndFinalizeEscrowPSBT: jest.fn(() => ({ toHex: () => "signedTxHex" })),
}));

const buyerId =
  "03a9ea8d8000731f80287b43af99f28294b81ee011a5bde5dfd2beb6c03f6e3682";
const sellerId =
  "02c2b2ec0ad0b4a0cbe6b1df4a1ffa4ba1d14b1e1e1b4f1f44e0d02bfbd8a2f7d0";
const returnAddress = payments.p2wpkh({
  pubkey: Buffer.from(buyerId, "hex"),
  network: networks.regtest,
}).address!;

const buildPsbt = (addresses: string[]) => {
  const psbt = new Psbt({ network: networks.regtest });
  psbt.addInput({ hash: "00".repeat(32), index: 0 });
  addresses.forEach((address) => psbt.addOutput({ address, value: 1000 }));
  return psbt.toBase64();
};

const refundableContract = {
  id: "12-34",
  escrowVersion: 3,
  buyOffer69Id: 34,
  escrow: "bcrt1pescrow",
  canceled: true,
  disputeActive: false,
  releaseTxId: undefined,
  buyer: { id: buyerId },
  seller: { id: sellerId },
} as unknown as Contract;

const getContractMock = jest.spyOn(peachAPI.private.contract, "getContract");
const getPsbtMock = jest.spyOn(
  peachAPI.private.contract,
  "getBuyerOnlyEscrowRefundPsbt",
);
const postRefundMock = jest.spyOn(
  peachAPI.private.contract,
  "postBuyerOnlyEscrowRefund",
);
const getFundingStatusMock = jest.spyOn(
  peachAPI.private.offer,
  "getFundingStatus",
);

const mockContract = (overrides: Partial<Contract> = {}) =>
  getContractMock.mockResolvedValue({
    result: { ...refundableContract, ...overrides },
    ...{ error: undefined },
  } as never);

describe("refundBuyerOnlyEscrow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPublicKey = buyerId;
    mockContract();
    getPsbtMock.mockResolvedValue({
      result: { psbt: buildPsbt([returnAddress]) },
    } as never);
    getFundingStatusMock.mockResolvedValue({
      result: { returnAddress },
    } as never);
    postRefundMock.mockResolvedValue({
      result: { success: true, txId: "txId" },
    } as never);
  });

  const expectNothingSigned = () => {
    expect(signAndFinalizeEscrowPSBT).not.toHaveBeenCalled();
    expect(postRefundMock).not.toHaveBeenCalled();
  };

  it("signs and submits the refund of a canceled contract", async () => {
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("refunded");
    expect(postRefundMock).toHaveBeenCalledWith({
      contractId: "12-34",
      tx: "signedTxHex",
    });
  });

  it("signs only once when called twice at the same time", async () => {
    const results = await Promise.all([
      refundBuyerOnlyEscrow("12-34"),
      refundBuyerOnlyEscrow("12-34"),
    ]);
    expect(results).toEqual(["refunded", "refunded"]);
    expect(postRefundMock).toHaveBeenCalledTimes(1);
  });

  it("never refunds a contract that is not buyer-only", async () => {
    mockContract({ escrowVersion: 2 });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("never");
    expectNothingSigned();
  });

  it("never refunds when we are the seller", async () => {
    mockPublicKey = sellerId;
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("never");
    expectNothingSigned();
  });

  it("never refunds an escrow that was already released", async () => {
    mockContract({ releaseTxId: "releaseTxId" });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("never");
    expectNothingSigned();
  });

  it("never refunds when the buyer won the dispute, even if canceled", async () => {
    mockContract({ disputeWinner: "buyer" });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("never");
    expect(getPsbtMock).not.toHaveBeenCalled();
    expectNothingSigned();
  });

  it("refunds when the seller won the dispute and the contract is canceled", async () => {
    mockContract({ disputeWinner: "seller" });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("refunded");
  });

  it("does not refund while the payment is late: the seller can give more time", async () => {
    mockContract({ canceled: false, tradeStatus: "paymentTooLate" });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("notDue");
    expect(getPsbtMock).not.toHaveBeenCalled();
    expectNothingSigned();
  });

  it("does not refund while a cancelation is only requested", async () => {
    mockContract({ canceled: false, cancelationRequested: true });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("notDue");
    expectNothingSigned();
  });

  it("does not refund while a dispute is open", async () => {
    mockContract({ disputeActive: true });
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("notDue");
    expectNothingSigned();
  });

  it("does not refund when the server says no refund is due", async () => {
    getPsbtMock.mockResolvedValue({
      error: { error: "FORBIDDEN" },
    } as never);
    expect(await refundBuyerOnlyEscrow("12-34")).toBe("notDue");
    expectNothingSigned();
  });

  it("refuses a refund that does not pay the seller's return address", async () => {
    getPsbtMock.mockResolvedValue({
      result: { psbt: buildPsbt([returnAddress, returnAddress]) },
    } as never);
    await expect(refundBuyerOnlyEscrow("12-34")).rejects.toThrow(
      "RETURN_ADDRESS_MISMATCH",
    );
    expectNothingSigned();
  });
});
