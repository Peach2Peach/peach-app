import { isContractId } from "./isContractId";

describe("isContractId", () => {
  it('should return true if the id includes a "-"', () => {
    expect(isContractId("123-456")).toBeTruthy();
  });

  it('should return false if the id does not include a "-"', () => {
    expect(isContractId("123")).toBeFalsy();
  });
});
