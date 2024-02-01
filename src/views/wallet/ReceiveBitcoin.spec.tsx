import { KeychainKind } from "bdk-rn/lib/lib/enums";
import { render, waitFor } from "test-utils";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { ReceiveBitcoin } from "./ReceiveBitcoin";

jest.useFakeTimers();

const addresses = [
  {
    index: 0,
    address: "firstAddress",
    used: true,
    keychain: KeychainKind.Internal,
  },
  {
    index: 1,
    address: "secondAddress",
    used: false,
    keychain: KeychainKind.Internal,
  },
  {
    index: 2,
    address: "thirdAddress",
    used: false,
    keychain: KeychainKind.Internal,
  },
];

describe("ReceiveBitcoin", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    peachWallet.initialized = true;
  });

  it("should render correctly while loading", () => {
    const { toJSON } = render(<ReceiveBitcoin />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when loaded", async () => {
    jest
      .spyOn(peachWallet, "getLastUnusedAddress")
      .mockResolvedValue(addresses[1]);
    jest
      .spyOn(peachWallet, "getAddressByIndex")
      .mockImplementation((index: number) => Promise.resolve(addresses[index]));
    const { toJSON } = render(<ReceiveBitcoin />);

    await waitFor(() => {
      expect(queryClient.getQueryState(["receiveAddress", 1])?.data).toEqual(
        addresses[1],
      );
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
