import { createRenderer } from "react-test-renderer/shallow";
import { render } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { fireSwipeEvent } from "../../../tests/unit/helpers/fireSwipeEvent";
import { RefundEscrowSlider } from "./RefundEscrowSlider";

const cancelAndStartRefundPopup = jest.fn();
jest.mock("../../popups/useCancelAndStartRefundPopup", () => ({
  useCancelAndStartRefundPopup: () => cancelAndStartRefundPopup,
}));

describe("RefundEscrowSlider", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(<RefundEscrowSlider sellOffer={sellOffer} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("opens refund popup", () => {
    const { getByTestId } = render(
      <RefundEscrowSlider sellOffer={sellOffer} />,
    );
    fireSwipeEvent({ element: getByTestId("confirmSlider"), x: 260 });
    expect(cancelAndStartRefundPopup).toHaveBeenCalledWith(sellOffer);
  });
});
