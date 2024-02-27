import { ElementsValue } from "liquidjs-lib";
import { numberConverter } from "./numberConverter";

describe("numberConverter", () => {
  const number = 10;
  it("should convert buffer to number", () => {
    expect(numberConverter(ElementsValue.fromNumber(number).bytes)).toEqual(
      number,
    );
  });
  it("should keep number", () => {
    expect(numberConverter(number)).toEqual(number);
  });
});
