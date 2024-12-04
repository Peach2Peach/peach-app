import { toMatchDiffSnapshot } from "snapshot-diff";
import { render } from "test-utils";
import { Button } from "./Button";
expect.extend({ toMatchDiffSnapshot });

jest.mock("../../hooks/useIsMediumScreen", () => ({
  useIsMediumScreen: () => false,
}));
jest.useFakeTimers();

describe("NewButton", () => {
  it("should render correctly", () => {
    const defaultButton = render(<Button>Text</Button>).toJSON();
    expect(defaultButton).toMatchSnapshot();
  });
  it("should render correctly with icon", () => {
    const defaultButton = render(<Button>Text</Button>).toJSON();
    const { toJSON } = render(<Button iconId="alertCircle">Text</Button>);
    expect(defaultButton).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly when disabled", () => {
    const defaultButton = render(<Button>Text</Button>).toJSON();
    const { toJSON } = render(<Button disabled>Text</Button>);
    expect(defaultButton).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly when ghost is true", () => {
    const defaultButton = render(<Button>Text</Button>).toJSON();
    const { toJSON } = render(<Button ghost>Text</Button>);
    expect(defaultButton).toMatchDiffSnapshot(toJSON());
  });
});
