import { createRenderer } from "react-test-renderer/shallow";
import tw from "../../styles/tailwind";
import { ParsedPeachText } from "./ParsedPeachText";

describe("ParsedPeachText", () => {
  const renderer = createRenderer();

  it("should render correctly", () => {
    renderer.render(
      <ParsedPeachText
        parse={[{ pattern: "pattern", style: tw`text-success-main` }]}
      >
        Text pattern
      </ParsedPeachText>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
