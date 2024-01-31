import { createRenderer } from "react-test-renderer/shallow";
import { TabbedNavigation } from "./TabbedNavigation";

describe("TabbedNavigation", () => {
  const shallowRenderer = createRenderer();
  const items = [
    {
      id: "id1",
      display: "display1",
    },
    {
      id: "id2",
      display: "display2",
    },
    {
      id: "id3",
      display: "display3",
    },
  ];
  const select = jest.fn();
  it("should render correctly", () => {
    shallowRenderer.render(
      <TabbedNavigation {...{ items, selected: items[0], select }} />,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});
