import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { ChainSelect } from "./ChainSelect";
expect.extend({ toMatchDiffSnapshot });

describe("ChainSelect", () => {
  const onSelect = jest.fn();
  const base = render(
    <ChainSelect current="bitcoin" onSelect={onSelect} />,
  ).toJSON();

  it("should render correctly when bitcoin is selected", () => {
    expect(base).toMatchSnapshot();
  });
  it("should render correctly when liquid is selected", () => {
    const { toJSON } = render(
      <ChainSelect current="liquid" onSelect={onSelect} />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should render correctly when lightning is selected", () => {
    const { toJSON } = render(
      <ChainSelect current="lightning" onSelect={onSelect} />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should should navigate to each wallet type", () => {
    const { getByText, rerender } = render(
      <ChainSelect current="lightning" onSelect={onSelect} />,
    );
    fireEvent.press(getByText("bitcoin"));
    expect(onSelect).toHaveBeenCalledWith("bitcoin");
    rerender(<ChainSelect current="bitcoin" onSelect={onSelect} />);
    fireEvent.press(getByText("lightning"));
    expect(onSelect).toHaveBeenCalledWith("lightning");
    rerender(<ChainSelect current="lightning" onSelect={onSelect} />);
    fireEvent.press(getByText("liquid"));
    expect(onSelect).toHaveBeenCalledWith("liquid");
  });
  it("should filter chains", () => {
    const { toJSON } = render(
      <ChainSelect current="bitcoin" filter={["liquid"]} onSelect={onSelect} />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
});
