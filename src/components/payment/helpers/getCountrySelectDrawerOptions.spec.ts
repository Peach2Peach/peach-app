import { btcPrague } from "../../../../tests/unit/data/eventData";
import { getCountrySelectDrawerOptions } from "./getCountrySelectDrawerOptions";

describe("getCountrySelectDrawerOptions", () => {
  const goToEventDetails = jest.fn();
  const selectCountry = jest.fn();
  const result = getCountrySelectDrawerOptions(
    [btcPrague],
    goToEventDetails,
    selectCountry,
  );

  it("should return country select drawer options", () => {
    expect(result).toEqual({
      options: expect.arrayContaining([
        {
          highlighted: true,
          onPress: expect.any(Function),
          subtext: "Prague",
          title: "BTC Prague",
        },
        {
          flagID: "CZ",
          onPress: expect.any(Function),
          title: "Czech Republic",
        },
      ]),
      show: true,
      title: "select country",
    });
  });
  it("should go to event details directly for super featured events", () => {
    result.options.find((event) => "highlighted" in event)?.onPress();
    expect(goToEventDetails).toHaveBeenCalledWith(btcPrague.id);
  });
  it("should select country when pressing on country option", () => {
    result.options.find((event) => !("highlighted" in event))?.onPress();
    expect(selectCountry).toHaveBeenCalledWith(
      expect.objectContaining({ CZ: [btcPrague] }),
      "CZ",
    );
  });
});
