import { isContained } from "./isContained";

describe("isContained", () => {
  const genesisBlock = {
    hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    timestamp: 1231006505,
    transactions: 1,
  };

  it("should return true if the object is contained within the bigger object", () => {
    const block = {
      timestamp: 1231006505,
    };

    expect(isContained(block, genesisBlock)).toBe(true);
  });
  it("should return false if any key is missing in the bigger object", () => {
    const block = {
      timestamp: 1231006505,
      height: 0,
    };

    expect(isContained(block, genesisBlock)).toBe(false);
  });
  it("should return false if the values of any key do not match in the bigger object", () => {
    const block = {
      hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      timestamp: 1231006505,
      transactions: 2,
    };

    expect(isContained(block, genesisBlock)).toBe(false);
  });
  it("should return true if the object is empty", () => {
    const emptyObject = {};

    expect(isContained(emptyObject, genesisBlock)).toBe(true);
  });
});
