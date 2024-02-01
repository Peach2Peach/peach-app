import { keys } from "./keys";

describe("keys", () => {
  it("should return keys from object", () => {
    expect(keys({ b: 1, c: 2 })).toEqual(["b", "c"]);
  });
});
