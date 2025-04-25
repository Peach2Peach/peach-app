import { balticHoneyBadger } from "../../../../tests/unit/data/eventData";
import { mapEventToDrawerOption } from "./mapEventToDrawerOption";

describe("mapEventToDrawerOption", () => {
  const onPress = jest.fn();

  it("should map event to drawer option", () => {
    const result = mapEventToDrawerOption(onPress)(balticHoneyBadger);
    expect(result).toEqual({
      highlighted: balticHoneyBadger.featured,
      onPress: expect.any(Function),
      subtext: balticHoneyBadger.city,
      title: balticHoneyBadger.longName,
    });
    result.onPress();
    expect(onPress).toHaveBeenCalledWith(balticHoneyBadger.id);
  });
});
