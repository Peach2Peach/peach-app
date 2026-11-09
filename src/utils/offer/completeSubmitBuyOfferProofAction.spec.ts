import { completeSubmitBuyOfferProofAction } from "./completeSubmitBuyOfferProofAction";

const mockPost = jest.fn();
const mockGetProof = jest.fn((..._args: unknown[]) => ({ publicKey: "02ab" }));

jest.mock("../peachAPI", () => ({
  peachAPI: {
    private: {
      peach069: {
        postMobilePendingActionSubmitBuyOfferProof: (...args: unknown[]) =>
          mockPost(...args),
      },
    },
  },
}));
jest.mock("../account/account", () => ({
  useAccountStore: {
    getState: () => ({ account: { publicKey: "userId" } }),
  },
}));
jest.mock("../wallet/getWallet", () => ({ getWallet: () => "wallet" }));
jest.mock("./getBuyOfferPublicKeyProof", () => ({
  getBuyOfferPublicKeyProof: (...args: unknown[]) => mockGetProof(...args),
}));

const params = { id: "7", buyOfferId: "123" };

describe("completeSubmitBuyOfferProofAction", () => {
  beforeEach(() => jest.clearAllMocks());

  it("posts the proof to the action, using the offer's key", async () => {
    mockPost.mockResolvedValueOnce({ result: { success: true } });

    await expect(completeSubmitBuyOfferProofAction(params)).resolves.toBe(true);

    expect(mockGetProof).toHaveBeenCalledWith("wallet", "userId", "123");
    expect(mockPost).toHaveBeenCalledWith({ id: "7", publicKey: "02ab" });
  });

  it.each(["FORBIDDEN", "Public key already submitted"])(
    "treats %s as already handled",
    async (error) => {
      mockPost.mockResolvedValueOnce({ error: { error } });

      await expect(completeSubmitBuyOfferProofAction(params)).resolves.toBe(
        false,
      );
    },
  );

  it("throws other server errors", async () => {
    mockPost.mockResolvedValueOnce({ error: { error: "NOT_FOUND" } });

    await expect(completeSubmitBuyOfferProofAction(params)).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});
