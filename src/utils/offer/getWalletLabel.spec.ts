import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../wallet/PeachWallet";
import { setLiquidWallet, setPeachWallet } from "../wallet/setWallet";
import { getWalletLabel } from "./getWalletLabel";

describe("getWalletLabel", () => {
  const customAddress = "customPayoutAddress";
  const customAddressLabel = "customPayoutAddressLabel";
  let peachWallet: PeachWallet;
  let peachLiquidWallet: PeachLiquidJSWallet;
  beforeAll(() => {
    peachWallet = new PeachWallet({ wallet: createTestWallet() });
    peachLiquidWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
    setPeachWallet(peachWallet);
    setLiquidWallet(peachLiquidWallet);
  });
  it("should return customPayoutAddressLabel if address is customPayoutAddress", () => {
    const findKeyPairByAddressMock = jest.spyOn(
      peachWallet,
      "findKeyPairByAddress",
    );
    const result = getWalletLabel({
      address: customAddress,
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    });
    expect(findKeyPairByAddressMock).not.toHaveBeenCalled();

    expect(result).toEqual(customAddressLabel);
  });

  it("should return peach liquid wallet if address is in peachLiquidWallet", () => {
    const result = getWalletLabel({
      address: peachLiquidWallet.getAddress().address,
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    });

    expect(result).toEqual("Peach liquid wallet");
  });
  it("should return peachWallet if address is in peachWallet", () => {
    jest
      .spyOn(peachWallet, "findKeyPairByAddress")
      .mockReturnValueOnce(createTestWallet());
    const result = getWalletLabel({
      address: "address",
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    });

    expect(result).toEqual("Peach wallet");
  });

  it('should return "custom payout address" if address is not peachWallet or customPayoutAddress', () => {
    const result = getWalletLabel({
      address: "address",
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    });

    expect(result).toEqual("custom payout address");
  });
  it('should return "custom payout address" if no address is passed', () => {
    const result = getWalletLabel({
      address: undefined,
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    });

    expect(result).toEqual("custom payout address");
  });
  it('returns "custom payout address" if no customPayoutAddressLabel but the address is the customPayoutAddress', () => {
    const result = getWalletLabel({
      address: customAddress,
      customAddress,
      customAddressLabel: undefined,
      isPeachWalletActive: true,
    });

    expect(result).toEqual("custom payout address");
  });
  it('returns "custom payout address" if the peach wallet is not active', () => {
    const result = getWalletLabel({
      address: "address",
      customAddress: undefined,
      customAddressLabel: undefined,
      isPeachWalletActive: false,
    });

    expect(result).toEqual("custom payout address");
  });
});
