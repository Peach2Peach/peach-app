import { Linking } from "react-native";
import { fireEvent, render, waitFor } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { EscrowLink } from "./EscrowLink";

describe("EscrowLink", () => {
  jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("renders correctly", () => {
    const { toJSON } = render(<EscrowLink address={sellOffer.returnAddress} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("opens escrow address", async () => {
    const { getByText } = render(
      <EscrowLink address={sellOffer.returnAddress} />,
    );
    fireEvent.press(getByText("view escrow in explorer"));
    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(
        `https://localhost:3000/address/${sellOffer.returnAddress}`,
      );
    });
  });
});
