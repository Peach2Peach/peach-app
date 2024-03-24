import { createRenderer } from "react-test-renderer/shallow";
import { toMatchDiffSnapshot } from "snapshot-diff";
import tw from "../../styles/tailwind";
import { AmountSummaryItem } from "./AmountSummaryItem";
expect.extend({ toMatchDiffSnapshot });

jest.mock("../../hooks/useIsMediumScreen");
const useIsMediumScreenMock = jest
  .requireMock("../../hooks/useIsMediumScreen")
  .useIsMediumScreen.mockReturnValue(false);

describe("AmountSummaryItem", () => {
  const renderer = createRenderer();
  renderer.render(
    <AmountSummaryItem amount={1000} chain="bitcoin" style={tw`mt-4`} />,
  );
  const base = renderer.getRenderOutput();
  it("renders correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("renders correctly for medium screens", () => {
    useIsMediumScreenMock.mockReturnValue(true);
    renderer.render(
      <AmountSummaryItem amount={1000} chain="bitcoin" style={tw`mt-4`} />,
    );
    expect(renderer.getRenderOutput()).toMatchDiffSnapshot(base);
  });
});
