import { Linking } from "react-native";
import { goToShiftCrypto } from "./goToShiftCrypto";

describe("goToShiftCrypto", () => {
  it("should open the correct link", async () => {
    const openStub = jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);

    await goToShiftCrypto();

    expect(openStub).toHaveBeenCalledWith(
      "https://bitbox.swiss/bitbox02/?ref=DLX6l9ccCc",
    );
  });
});
