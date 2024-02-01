import { enforceDecimalsFormat } from "./enforceDecimalsFormat";

describe("enforceDecimalsFormat", () => {
  it("should not transform integers", () => {
    expect(enforceDecimalsFormat("1", 2)).toBe("1");
    expect(enforceDecimalsFormat("203984", 2)).toBe("203984");
    expect(enforceDecimalsFormat("-1", 2)).toBe("-1");
  });
  it("enforce max number of decimals", () => {
    expect(enforceDecimalsFormat("1.1234", 2)).toBe("1.12");
    expect(enforceDecimalsFormat("203984.1", 2)).toBe("203984.1");
    const NUMBER_OF_DECIMALS = 3;
    expect(enforceDecimalsFormat("-1.1234", NUMBER_OF_DECIMALS)).toBe("-1.123");
  });
  it("remove decimals", () => {
    expect(enforceDecimalsFormat("1.1234", 0)).toBe("1");
    expect(enforceDecimalsFormat("203984.1", 0)).toBe("203984");
    expect(enforceDecimalsFormat("-1.1234", 0)).toBe("-1");
  });
});
