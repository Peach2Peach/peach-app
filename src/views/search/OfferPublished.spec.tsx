import { fireEvent, render } from "test-utils";
import {
  navigateMock,
  resetMock,
} from "../../../tests/unit/helpers/NavigationWrapper";
import { OfferPublished } from "./OfferPublished";

const offerId = "123";

describe("OfferPublished", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <OfferPublished offerId={offerId} shouldGoBack={false} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("should go to search when pressing show offer button", () => {
    const { getByText } = render(
      <OfferPublished offerId={offerId} shouldGoBack={false} />,
    );
    const button = getByText("show offer");
    fireEvent.press(button);
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.sell" } },
        },
        { name: "search", params: { offerId } },
      ],
    });
  });
  it("should go back to buy for buy offers when pressing back close button", () => {
    const { getByText } = render(
      <OfferPublished offerId={offerId} shouldGoBack={false} />,
    );
    const closeButton = getByText("close");
    fireEvent.press(closeButton);
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", { screen: "home" });
  });
  it("should go back to sell for sell offers when pressing back close button", () => {
    const { getByText } = render(
      <OfferPublished offerId={offerId} shouldGoBack={false} />,
    );
    const closeButton = getByText("close");
    fireEvent.press(closeButton);
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", { screen: "home" });
  });
});
