import { submitBuyOfferPublicKey } from "./submitBuyOfferPublicKey";

const mockSubmit = jest.fn();
const mockGetBuyOffer = jest.fn();

jest.mock("../peachAPI", () => ({
  peachAPI: {
    private: {
      peach069: {
        submitBuyOfferPublicKey: (...args: unknown[]) => mockSubmit(...args),
        getBuyOfferById: (...args: unknown[]) => mockGetBuyOffer(...args),
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
  getBuyOfferPublicKeyProof: () => ({ publicKey: "02ab" }),
}));

const alreadySubmitted = { error: { error: "Public key already submitted" } };

describe("submitBuyOfferPublicKey", () => {
  beforeEach(() => jest.clearAllMocks());

  it("submits the key for the offer", async () => {
    mockSubmit.mockResolvedValueOnce({ result: true });

    await submitBuyOfferPublicKey("123");

    expect(mockSubmit).toHaveBeenCalledWith({
      buyOfferId: "123",
      publicKey: "02ab",
    });
    expect(mockGetBuyOffer).not.toHaveBeenCalled();
  });

  it("treats an already submitted key as success once confirmed", async () => {
    mockSubmit.mockResolvedValueOnce(alreadySubmitted);
    mockGetBuyOffer.mockResolvedValueOnce({ result: { publicKey: "02ab" } });

    await expect(submitBuyOfferPublicKey("123")).resolves.toBeUndefined();
  });

  it("fails if the re-fetch does not confirm the key", async () => {
    mockSubmit.mockResolvedValueOnce(alreadySubmitted);
    mockGetBuyOffer.mockResolvedValueOnce({ result: { publicKey: null } });

    await expect(submitBuyOfferPublicKey("123")).rejects.toThrow(
      "Public key already submitted",
    );
  });

  it("throws other server errors", async () => {
    mockSubmit.mockResolvedValueOnce({ error: { error: "NOT_FOUND" } });

    await expect(submitBuyOfferPublicKey("123")).rejects.toThrow("NOT_FOUND");
  });
});
