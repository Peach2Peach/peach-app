import { Script } from "bdk-rn/lib/classes/Script";
import { render, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { walletKeys } from "../hooks/useUTXOs";
import { UTXOAddress } from "./UTXOAddress";

jest.useFakeTimers();

describe("UTXOAddress", () => {
  const script = new Script("address");
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  it("should render correctly", async () => {
    useWalletState.setState({ addressLabelMap: { address: "addressLabel" } });
    const { toJSON } = render(<UTXOAddress script={script} />);

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
      expect(queryClient.getQueryData(walletKeys.utxoAddress(script.id))).toBe(
        "address",
      );
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
