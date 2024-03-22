import { fireEvent, render } from "@testing-library/react-native";
import { createRenderer } from "react-test-renderer/shallow";
import { Bubble, NewBubble } from "./Bubble";

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

describe("NewBubble", () => {
  const shallowRenderer = createRenderer();
  it("should render correctly a primary bubble", () => {
    shallowRenderer.render(<NewBubble color="orange">Text</NewBubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary bubble with icon", () => {
    shallowRenderer.render(
      <NewBubble color="orange" iconId="chevronsUp">
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with primary bubble with no background", () => {
    shallowRenderer.render(
      <NewBubble color="orange" ghost>
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary-mild bubble", () => {
    shallowRenderer.render(<NewBubble color="primary-mild">Text</NewBubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a primary-mild bubble with icon", () => {
    shallowRenderer.render(
      <NewBubble color="primary-mild" iconId="chevronsUp">
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with primary-mild bubble with no background", () => {
    shallowRenderer.render(
      <NewBubble color="primary-mild" ghost>
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a gray bubble", () => {
    shallowRenderer.render(<NewBubble color="gray">Text</NewBubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a liquid color bubble", () => {
    shallowRenderer.render(<NewBubble color="liquid">Text</NewBubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a gray bubble with icon", () => {
    shallowRenderer.render(
      <NewBubble color="gray" iconId="chevronsUp">
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with gray bubble with no background", () => {
    shallowRenderer.render(
      <NewBubble color="gray" ghost>
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a black bubble", () => {
    shallowRenderer.render(<NewBubble color="black">Text</NewBubble>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly a black bubble with icon", () => {
    shallowRenderer.render(
      <NewBubble color="black" iconId="chevronsUp">
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with black bubble with no background", () => {
    shallowRenderer.render(
      <NewBubble color="black" ghost>
        Text
      </NewBubble>,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should call onPress handler on press", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <NewBubble color="orange" onPress={onPress}>
        Text
      </NewBubble>,
    );
    fireEvent.press(getByText("Text"));
    expect(onPress).toHaveBeenCalled();
  });
});
