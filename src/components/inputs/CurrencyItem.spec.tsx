import { createRenderer } from "react-test-renderer/shallow";
import { CurrencyItem } from "./CurrencyItem";

describe("CurrencyItem", () => {
  const renderer = createRenderer();
  it("renders correctly when selected", () => {
    renderer.render(
      <CurrencyItem label="EUR" onPress={jest.fn()} isSelected />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("renders correctly when not selected", () => {
    renderer.render(
      <CurrencyItem label="EUR" onPress={jest.fn()} isSelected={false} />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
