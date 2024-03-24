import { Linking } from "react-native";
import { fireEvent, render, waitFor } from "test-utils";
import { contract } from "../../../../peach-api/src/testData/contract";
import { liquidAddresses } from "../../../../tests/unit/data/liquidNetworkData";
import { ShowInExplorer } from "./ShowInExplorer";

describe("ShowInExplorer", () => {
  const txId = contract.releaseTxId;
  const address = contract.escrow;
  jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
  const openURLSpy = jest.spyOn(Linking, "openURL");
  it("should render correctly", () => {
    const { toJSON } = render(<ShowInExplorer {...{ txId, address }} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should open address address", async () => {
    const { getByText } = render(
      <ShowInExplorer {...{ txId: undefined, address }} />,
    );
    fireEvent.press(getByText("show in explorer"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith(
        "https://localhost:3000/address/bcrt1qxhkluxqp9u5f4a79vclgdah5vrzjzn2t8yn5rje3cnkvqk6u9fgqe5raag",
      ),
    );
  });
  it("should open transaction if passed", async () => {
    const { getByText } = render(
      <ShowInExplorer {...{ txId: "txId", address }} />,
    );
    fireEvent.press(getByText("show in explorer"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3000/tx/txId"),
    );
  });
  it("should open transaction for liquid network if passed", async () => {
    const { getByText } = render(
      <ShowInExplorer
        {...{ txId: "txId", address: liquidAddresses.regtest[0] }}
      />,
    );
    fireEvent.press(getByText("show in explorer"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3001/tx/txId"),
    );
  });
});
