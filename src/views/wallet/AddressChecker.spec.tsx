import { Wallet } from "bdk-rn";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render, waitFor } from "test-utils";
import { account1 } from "../../../tests/unit/data/accountData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { walletIsMineMock } from "../../../tests/unit/mocks/bdkRN";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { createWalletFromBase58 } from "../../utils/wallet/createWalletFromBase58";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { peachWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { AddressChecker } from "./AddressChecker";
import { walletKeys } from "./hooks/useUTXOs";
expect.extend({ toMatchDiffSnapshot });

const validAddress = "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0";
const invalidAddress = "invalidAddress";

jest.useFakeTimers();

describe("AddressChecker", () => {
  beforeAll(() => {
    const wallet = createWalletFromBase58(account1.base58, getNetwork());
    setPeachWallet(new PeachWallet({ wallet }));
    peachWallet.wallet = new Wallet();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly", () => {
    const { toJSON } = render(<AddressChecker />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when address belongs to wallet", async () => {
    walletIsMineMock.mockResolvedValue(true);
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />);
    const withoutAddress = toJSON();

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(addressInput, validAddress);

    await waitFor(() => {
      expect(
        queryClient.getQueryData(walletKeys.belongsToWallet(validAddress)),
      ).toBe(true);
    });
    const withAddress = toJSON();
    expect(withoutAddress).toMatchDiffSnapshot(withAddress);
  });

  it("should render correctly when address does not belong to wallet", async () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />);
    const withoutAddress = toJSON();
    walletIsMineMock.mockResolvedValue(false);

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(addressInput, validAddress);

    await waitFor(() => {
      expect(
        queryClient.getQueryData(walletKeys.belongsToWallet(validAddress)),
      ).toBe(false);
    });
    const withAddress = toJSON();
    expect(withoutAddress).toMatchDiffSnapshot(withAddress);
  });
  it("should render correctly while loading", () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />);
    const withoutAddress = toJSON();
    walletIsMineMock.mockResolvedValue(true);

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(addressInput, validAddress);

    const withAddress = toJSON();
    expect(withoutAddress).toMatchDiffSnapshot(withAddress);
    expect(
      queryClient.getQueryData(walletKeys.belongsToWallet(validAddress)),
    ).toBe(undefined);
  });
  it("should render correctly when address is invalid", async () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />);
    const withoutAddress = toJSON();
    walletIsMineMock.mockResolvedValue(false);

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(addressInput, invalidAddress);

    await waitFor(() => {
      expect(
        queryClient.getQueryData(walletKeys.belongsToWallet(invalidAddress)),
      ).toBe(undefined);
    });
    const withAddress = toJSON();
    expect(withoutAddress).toMatchDiffSnapshot(withAddress);
  });
});
