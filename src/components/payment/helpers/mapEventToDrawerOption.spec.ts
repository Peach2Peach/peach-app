import { btcPrague } from "../../../../tests/unit/data/eventData";
import { mapEventToDrawerOption } from "./mapEventToDrawerOption";

describe("mapEventToDrawerOption", () => {
  const onPress = jest.fn();

  it("should map event to drawer option", () => {
    const result = mapEventToDrawerOption(onPress)(btcPrague);
    expect(result).toEqual({
      highlighted: btcPrague.featured,
      onPress: expect.any(Function),
      subtext: btcPrague.city,
      title: btcPrague.longName,
    });
    result.onPress();
    expect(onPress).toHaveBeenCalledWith(btcPrague.id);
  });
});
