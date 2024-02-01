import { getError } from "./getError";

describe("getError", () => {
  it("returns an error object", () => {
    const error = "error";
    const result = getError(error);
    expect(result.isOk()).toBeFalsy();
    expect(result.getValue()).toBeUndefined();
    expect(result.isError()).toBeTruthy();
    expect(result.getError()).toBe(error);
  });
});
