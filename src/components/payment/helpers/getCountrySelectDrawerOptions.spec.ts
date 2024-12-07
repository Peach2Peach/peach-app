import { balticHoneyBadger } from "../../../../tests/unit/data/eventData";
import { getCountrySelectDrawerOptions } from "./getCountrySelectDrawerOptions";

describe("getCountrySelectDrawerOptions", () => {
  const goToEventDetails = jest.fn();
  const selectCountry = jest.fn();
  const result = getCountrySelectDrawerOptions(
    [balticHoneyBadger],
    goToEventDetails,
    selectCountry,
  );

  it("should return country select drawer options", () => {
    expect(result).toEqual({
      options: expect.arrayContaining([
        {
          highlighted: true,
          onPress: expect.any(Function),
          subtext: "Riga",
          title: "Baltic Honeybadger",
        },
        {
          flagID: "LV",
          onPress: expect.any(Function),
          title: "Latvia",
        },
      ]),
      show: true,
      title: "select country",
    });
  });
  it("should go to event details directly for super featured events", () => {
    result.options.find((event) => event.highlighted)?.onPress();
    expect(goToEventDetails).toHaveBeenCalledWith(balticHoneyBadger.id);
  });
  it("should select country when pressing on country option", () => {
    result.options.find((event) => !event.highlighted)?.onPress();
    expect(selectCountry).toHaveBeenCalledWith(
      expect.objectContaining({ LV: [balticHoneyBadger] }),
      "AD",
    );
  });
});
