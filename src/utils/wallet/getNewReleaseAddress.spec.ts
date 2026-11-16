import { AddressIndex } from "./bdkShim";
import { getNewReleaseAddress } from "./getNewReleaseAddress";
import { saveLastAddressUsedIndex } from "./saveLastAddressUsedIndex";
import { useWalletState } from "./walletStore";

jest.mock("./saveLastAddressUsedIndex", () => ({
  saveLastAddressUsedIndex: jest.fn(),
}));

let nextBdkIndex = 0;
let bdkFails = false;
const mockGetAddress = jest.fn(
  (index: AddressIndex | number, _keychain?: string, _reveal?: boolean) => {
    if (bdkFails) throw new Error("WALLET_NOT_READY");
    // LastUnused and New both give the next unrevealed index here
    const resolved = typeof index === "number" ? index : nextBdkIndex;
    nextBdkIndex = Math.max(nextBdkIndex, resolved + 1);
    return { index: resolved, keychain: "external", address: `bdk${resolved}` };
  },
);
const mockGetAddressFromJsWallet = jest.fn((index: number) => `bdk${index}`);

jest.mock("./setWallet", () => ({
  peachWallet: {
    getAddress: (...args: [AddressIndex | number, string?, boolean?]) =>
      mockGetAddress(...args),
    getAddressFromJsWallet: (index: number) =>
      mockGetAddressFromJsWallet(index),
  },
}));

describe("getNewReleaseAddress", () => {
  beforeEach(() => {
    nextBdkIndex = 0;
    bdkFails = false;
    useWalletState.setState({ externalUsedIndices: [] });
    jest.clearAllMocks();
  });

  it("uses the next BDK address and records it", () => {
    expect(getNewReleaseAddress(undefined)).toEqual({
      address: "bdk0",
      index: 0,
    });
    expect(saveLastAddressUsedIndex).toHaveBeenCalledWith(0);
  });

  it("goes above the server index when BDK is behind", () => {
    expect(getNewReleaseAddress(4).index).toBe(5);
  });

  it("goes above locally used indices when the server index is missing", () => {
    useWalletState.setState({ externalUsedIndices: [0, 2] });
    expect(getNewReleaseAddress(undefined).index).toBe(3);
  });

  it("never repeats an address when the JS fallback ran first (server index lost)", () => {
    bdkFails = true;
    const first = getNewReleaseAddress(undefined);
    expect(first.index).toBe(0);
    expect(useWalletState.getState().externalUsedIndices).toContain(0);

    bdkFails = false;
    const second = getNewReleaseAddress(undefined);
    expect(second.address).not.toBe(first.address);
  });

  it("never repeats an address when BDK ran first and the fallback runs next", () => {
    const first = getNewReleaseAddress(undefined);
    // the real BDK path marks the index used in the wallet store
    useWalletState.getState().markExternalIndexUsed(first.index);
    bdkFails = true;
    expect(getNewReleaseAddress(undefined).address).not.toBe(first.address);
  });

  it("treats a null server index like a missing one", () => {
    expect(getNewReleaseAddress(null).index).toBe(0);
  });
});
