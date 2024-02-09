import fetch from "../fetch";
import { generateBlock } from "./generateBlock";

jest.mock("../fetch");

describe("generateBlock", () => {
  it("should call correct api endpoint", async () => {
    await generateBlock();
    expect(fetch).toHaveBeenCalledWith(
      "https://localhost:8080/v1/regtest/generateBlock",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://localhost:8080",
          Referer: "https://localhost:8080",
          "User-Agent": "",
        },
        method: "GET",
      },
    );
  });
});
