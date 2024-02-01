import { enforceBICFormat } from "./enforceBICFormat";

describe("enforceBICFormat", () => {
  it("should format a BIC string correctly", () => {
    expect(enforceBICFormat("deutdeff500")).toEqual("DEUT DE FF 500");
  });

  it("should remove any non-alphanumeric characters", () => {
    expect(enforceBICFormat("DeutDEFF 500!!")).toEqual("DEUT DE FF 500");
  });

  it("should format half a BIC string correctly", () => {
    expect(enforceBICFormat("deutd")).toEqual("DEUT D");
  });

  it("does not alter a formatted BIC", () => {
    expect(enforceBICFormat("AAAA BB CC 123")).toEqual("AAAA BB CC 123");
  });
  it("should return an empty string if input is an empty string", () => {
    expect(enforceBICFormat("")).toEqual("");
  });
});
