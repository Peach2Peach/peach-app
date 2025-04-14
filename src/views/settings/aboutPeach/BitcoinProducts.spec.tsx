import { Linking } from "react-native";
import { fireEvent, render, waitFor } from "test-utils";
import { BitcoinProducts } from "./BitcoinProducts";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useFocusEffect: jest.fn(),
}));

jest.useFakeTimers();
describe("BitcoinProducts", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<BitcoinProducts />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should link to bitbox", async () => {
    const openURLSpy = jest.spyOn(Linking, "openURL");
    const { getByText } = render(<BitcoinProducts />);
    fireEvent(getByText("check out bitbox"), "onPress");
    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(
        "https://bitbox.swiss/bitbox02/?ref=DLX6l9ccCc",
      );
    });
  });
});
