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
      options: [
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
      ],
      show: true,
      title: "select country",
    });
  });
  it("should go to event details directly for super featured events", () => {
    result.options[0].onPress();
    expect(goToEventDetails).toHaveBeenCalledWith(balticHoneyBadger.id);
  });
  it("should select country when pressing on country option", () => {
    result.options[1].onPress();
    expect(selectCountry).toHaveBeenCalledWith(
      { LV: [balticHoneyBadger] },
      "LV",
    );
  });
});
