import OpenPGP from "react-native-fast-openpgp";
import {
  getOldOfferIdDeclarationMessage,
  submitOldOfferIdSignature,
} from "./submitOldOfferIdSignature";

const mockGetSellOfferById = jest.fn();
const mockSubmit = jest.fn();
jest.mock("../peachAPI", () => ({
  peachAPI: {
    private: {
      peach069: {
        getSellOfferById: (...args: unknown[]) => mockGetSellOfferById(...args),
        submitSellOfferOldOfferIdSignature: (...args: unknown[]) =>
          mockSubmit(...args),
      },
    },
  },
}));
// the real account store pulls in immer's ESM build, which jest cannot parse
jest.mock("../account/account", () => ({
  useAccountStore: {
    getState: () => ({ account: { pgp: { privateKey: "privateKey" } } }),
  },
}));
jest.mock("../log/error");

jest.useFakeTimers();
const run = async (sellOfferId: string) => {
  const promise = submitOldOfferIdSignature(sellOfferId);
  await jest.runAllTimersAsync();
  return promise;
};

describe("submitOldOfferIdSignature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(OpenPGP, "sign").mockResolvedValue("armoredSignature");
  });

  it("builds the message as <oldOfferId>-<newOfferId>", () => {
    expect(getOldOfferIdDeclarationMessage("52", "71")).toBe("52-71");
  });

  it("signs with the oldOfferId the server set on the new offer", async () => {
    // republished twice: the server points oldOfferId at the original offer
    mockGetSellOfferById.mockResolvedValue({
      result: { id: "71", oldOfferId: "52", oldOfferIdSignature: null },
    });
    mockSubmit.mockResolvedValue({ result: { success: true } });

    await expect(run("71")).resolves.toBe(true);
    expect(OpenPGP.sign).toHaveBeenCalledWith("52-71", "privateKey", "");
    expect(mockSubmit).toHaveBeenCalledWith({
      sellOfferId: "71",
      oldOfferIdSignature: "armoredSignature",
    });
  });

  it("retries 5 times after the first failure, then gives up", async () => {
    mockGetSellOfferById.mockResolvedValue({
      result: { id: "71", oldOfferId: "52", oldOfferIdSignature: null },
    });
    mockSubmit.mockResolvedValue({ error: { error: "UNAUTHORIZED" } });

    await expect(run("71")).resolves.toBe(false);
    expect(mockSubmit).toHaveBeenCalledTimes(6);
  });

  it("recovers when a later attempt succeeds, also if the GET failed", async () => {
    mockGetSellOfferById
      .mockResolvedValueOnce({ error: { error: "NOT_FOUND" } })
      .mockResolvedValue({
        result: { id: "71", oldOfferId: "52", oldOfferIdSignature: null },
      });
    mockSubmit
      .mockResolvedValueOnce({ error: { error: "UNAUTHORIZED" } })
      .mockResolvedValue({ result: { success: true } });

    await expect(run("71")).resolves.toBe(true);
    expect(mockSubmit).toHaveBeenCalledTimes(2);
  });

  it("does nothing when the offer is already signed", async () => {
    mockGetSellOfferById.mockResolvedValue({
      result: { id: "71", oldOfferId: "52", oldOfferIdSignature: "sig" },
    });
    await expect(run("71")).resolves.toBe(true);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("stops without retrying when the offer has no oldOfferId", async () => {
    mockGetSellOfferById.mockResolvedValue({ result: { id: "71" } });
    await expect(run("71")).resolves.toBe(false);
    expect(mockGetSellOfferById).toHaveBeenCalledTimes(1);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
