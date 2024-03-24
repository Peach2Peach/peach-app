import { Linking } from "react-native";
import { fireEvent, render, waitFor } from "test-utils";
import { contract } from "../../peach-api/src/testData/contract";
import { liquidAddresses } from "../../tests/unit/data/liquidNetworkData";
import tw from "../styles/tailwind";
import { EscrowButton } from "./EscrowButton";

describe("EscrowButton", () => {
  const releaseTxId = contract.releaseTxId;
  const escrow = contract.escrow;
  jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
  const openURLSpy = jest.spyOn(Linking, "openURL");
  it("should render correctly", () => {
    const { toJSON } = render(
      <EscrowButton {...{ releaseTxId, escrow, style: tw`mt-4` }} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should open escrow address", async () => {
    const { getByText } = render(
      <EscrowButton {...{ releaseTxId: undefined, escrow }} />,
    );
    fireEvent.press(getByText("escrow"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith(
        "https://localhost:3000/address/bcrt1qxhkluxqp9u5f4a79vclgdah5vrzjzn2t8yn5rje3cnkvqk6u9fgqe5raag",
      ),
    );
  });
  it("should open transaction if passed", async () => {
    const { getByText } = render(
      <EscrowButton {...{ releaseTxId: "releaseTxId", escrow }} />,
    );
    fireEvent.press(getByText("escrow"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith(
        "https://localhost:3000/tx/releaseTxId",
      ),
    );
  });
  it("should open transaction for liquid network if passed", async () => {
    const { getByText } = render(
      <EscrowButton
        {...{ releaseTxId: "releaseTxId", escrow: liquidAddresses.regtest[0] }}
      />,
    );
    fireEvent.press(getByText("escrow"));
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith(
        "https://localhost:3001/tx/releaseTxId",
      ),
    );
  });
});
