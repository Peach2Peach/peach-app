import { Attributes, ReactElement } from "react";
import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { YourTrades } from "./YourTrades";

jest.useFakeTimers();

jest.mock("../home/useHomeScreenRoute", () => ({
  useHomeScreenRoute: jest.fn(() => ({
    params: {
      tab: "yourTrades.buy",
    },
  })),
}));
jest.mock("@react-navigation/material-top-tabs", () => {
  const createElement = jest.requireActual("react").createElement;
  return {
    createMaterialTopTabNavigator: jest.fn(() => ({
      Navigator: (props: Attributes) => createElement("Navigator", props),
      Screen: (props: { children: () => ReactElement<any> }) =>
        createElement("Screen", props, props.children()),
    })),
  };
});

describe("YourTrades", () => {
  it('should navigate to "exportTradeHistory" when clicking on the icon in the header', () => {
    const { getByAccessibilityHint } = render(<YourTrades />);
    const icon = getByAccessibilityHint("go to export trade history");
    fireEvent.press(icon);

    expect(navigateMock).toHaveBeenCalledWith("exportTradeHistory");
  });
});
