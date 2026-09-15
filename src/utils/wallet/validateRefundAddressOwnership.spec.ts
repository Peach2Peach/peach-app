import { Psbt } from "bitcoinjs-lib";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { isAddressMine } from "./isAddressMine";
import { peachWallet } from "./setWallet";
import { validateRefundAddressOwnership } from "./validateRefundAddressOwnership";

jest.mock("../../store/settingsStore/useSettingsStore", () => ({
  useSettingsStore: { getState: jest.fn() },
}));
jest.mock("./isAddressMine", () => ({ isAddressMine: jest.fn() }));
jest.mock("./setWallet", () => ({ peachWallet: { wallet: {} } }));

const getState = useSettingsStore.getState as jest.Mock;
const isAddressMineMock = isAddressMine as jest.Mock;

const RETURN_ADDRESS = "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq";
const psbtWithOutput = (address?: string) =>
  ({ txOutputs: [{ address }] }) as unknown as Psbt;

describe("validateRefundAddressOwnership", () => {
  beforeEach(() => {
    getState.mockReturnValue({ validateReturnAddressOwnership: true });
    isAddressMineMock.mockReturnValue(true);
  });

  it("passes when every output belongs to the Peach Wallet", () => {
    expect(() =>
      validateRefundAddressOwnership(psbtWithOutput(RETURN_ADDRESS)),
    ).not.toThrow();
    expect(isAddressMineMock).toHaveBeenCalledWith(RETURN_ADDRESS);
  });

  it("throws when an output does not belong to the Peach Wallet", () => {
    isAddressMineMock.mockReturnValue(false);
    expect(() =>
      validateRefundAddressOwnership(psbtWithOutput(RETURN_ADDRESS)),
    ).toThrow("REFUND_ADDRESS_NOT_OWNED");
  });

  it("throws when an output has no decodable address", () => {
    expect(() => validateRefundAddressOwnership(psbtWithOutput())).toThrow(
      "REFUND_ADDRESS_NOT_OWNED",
    );
  });

  it("treats an address that cannot be parsed as not ours", () => {
    isAddressMineMock.mockImplementation(() => {
      throw new Error("invalid address");
    });
    expect(() =>
      validateRefundAddressOwnership(psbtWithOutput("not-an-address")),
    ).toThrow("REFUND_ADDRESS_NOT_OWNED");
  });

  it("throws when the wallet is not loaded yet", () => {
    // @ts-expect-error the mocked module is writable
    peachWallet.wallet = undefined;
    expect(() =>
      validateRefundAddressOwnership(psbtWithOutput(RETURN_ADDRESS)),
    ).toThrow("WALLET_NOT_READY");
    // @ts-expect-error the mocked module is writable
    peachWallet.wallet = {};
  });

  it("skips the check when the user turned validation off", () => {
    getState.mockReturnValue({ validateReturnAddressOwnership: false });
    isAddressMineMock.mockReturnValue(false);
    expect(() =>
      validateRefundAddressOwnership(psbtWithOutput(RETURN_ADDRESS)),
    ).not.toThrow();
    expect(isAddressMineMock).not.toHaveBeenCalled();
  });
});
