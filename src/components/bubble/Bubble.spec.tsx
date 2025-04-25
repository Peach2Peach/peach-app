import { createRenderer } from "react-test-renderer/shallow";
import { Bubble } from "./Bubble";

describe("Bubble", () => {
  const shallowRenderer = createRenderer();
  it("should render correctly a primary bubble", () => {
    shallowRenderer.render(<Bubble color="primary">Text</Bubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary bubble with icon", () => {
    shallowRenderer.render(
      <Bubble color="primary" iconId="chevronsUp">
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with primary bubble with no background", () => {
    shallowRenderer.render(
      <Bubble color="primary" ghost>
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary-mild bubble", () => {
    shallowRenderer.render(<Bubble color="primary-mild">Text</Bubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary-mild bubble with icon", () => {
    shallowRenderer.render(
      <Bubble color="primary-mild" iconId="chevronsUp">
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with primary-mild bubble with no background", () => {
    shallowRenderer.render(
      <Bubble color="primary-mild" ghost>
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a gray bubble", () => {
    shallowRenderer.render(<Bubble color="gray">Text</Bubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a gray bubble with icon", () => {
    shallowRenderer.render(
      <Bubble color="gray" iconId="chevronsUp">
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with gray bubble with no background", () => {
    shallowRenderer.render(
      <Bubble color="gray" ghost>
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a black bubble", () => {
    shallowRenderer.render(<Bubble color="black">Text</Bubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a black bubble with icon", () => {
    shallowRenderer.render(
      <Bubble color="black" iconId="chevronsUp">
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with black bubble with no background", () => {
    shallowRenderer.render(
      <Bubble color="black" ghost>
        Text
      </Bubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});
