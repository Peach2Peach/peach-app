import { Linking } from "react-native";
import { showTransaction } from "./showTransaction";

describe("showTransaction", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to bitcoin blockexplorer", async () => {
    await showTransaction("txId", "bitcoin");
    expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3000/tx/txId");
  });
  it("links to liquid blockexplorer", async () => {
    await showTransaction("txId", "liquid");
    expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3001/tx/txId");
  });
});
