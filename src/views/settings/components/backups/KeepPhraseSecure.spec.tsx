import { createRenderer } from "react-test-renderer/shallow";
import { KeepPhraseSecure } from "./KeepPhraseSecure";

describe("KeepPhraseSecure", () => {
  const shallowRenderer = createRenderer();
  it("should render correctly", () => {
    shallowRenderer.render(<KeepPhraseSecure />);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});
