import { createRenderer } from "react-test-renderer/shallow";
import { Currencies } from "./Currencies";

describe("Currencies", () => {
  const renderer = createRenderer();
  const props = {
    currency: "EUR" as const,
    setCurrency: jest.fn(),
    type: "europe" as const,
  };

  it('should render correctly for type "europe"', () => {
    renderer.render(<Currencies {...props} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });

  it('should render correctly for type "latinAmerica"', () => {
    renderer.render(<Currencies {...props} type="latinAmerica" />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it('should render correctly for type "africa"', () => {
    renderer.render(<Currencies {...props} type="africa" />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it('should render correctly for type "other"', () => {
    renderer.render(<Currencies {...props} type="other" />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
