import { mockDimensions } from "../../../tests/unit/helpers/mockDimensions";
import { getHeaderStyles } from "./getHeaderStyles";

describe("getHeaderStyles", () => {
  it("returns header styles", () => {
    mockDimensions({ width: 320, height: 600 });

    const result = getHeaderStyles();

    expect(result).toEqual({
      fontSize: [
        {
          fontFamily: "Baloo2-Bold",
          fontSize: 16,
          letterSpacing: 0.16,
          lineHeight: 26,
        },
        {},
      ],
      iconSize: [{ height: 20, width: 20 }, {}],
    });
  });
});
