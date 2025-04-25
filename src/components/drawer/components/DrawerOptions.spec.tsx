import { ScrollView } from "react-native";
import { act, render } from "test-utils";
import { PeachText } from "../../text/PeachText";
import { defaultState, useDrawerState } from "../useDrawerState";
import { DrawerOptions } from "./DrawerOptions";

jest.mock("./DrawerOption", () => ({
  DrawerOption: "DrawerOption",
}));

describe("DrawerOptions", () => {
  const updateDrawer = useDrawerState.setState;
  beforeEach(() => {
    updateDrawer(defaultState);
  });
  it("renders correctly", () => {
    const { toJSON } = render(<DrawerOptions />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when there are options", () => {
    updateDrawer({
      options: [
        {
          title: "testLabel",
          onPress: jest.fn(),
        },
      ],
    });
    const { toJSON } = render(<DrawerOptions />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when there are highlighted options", () => {
    updateDrawer({
      options: [
        {
          title: "testLabel",
          subtext: "testSubtext",
          onPress: jest.fn(),
          highlighted: true,
        },
      ],
    });
    const { toJSON } = render(<DrawerOptions />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when there is content", () => {
    updateDrawer({
      content: <PeachText>testContent</PeachText>,
    });
    const { toJSON } = render(<DrawerOptions />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("scrolls to top when options or content change", () => {
    updateDrawer({
      options: [
        {
          title: "testLabel",
          onPress: jest.fn(),
        },
      ],
    });
    const { rerender } = render(<DrawerOptions />);
    const scrollToSpy = jest.spyOn(ScrollView.prototype, "scrollTo");
    expect(scrollToSpy).toHaveBeenCalledWith({ y: 0, animated: false });
    act(() => {
      updateDrawer({
        content: <PeachText>testContent</PeachText>,
      });
      rerender(<DrawerOptions />);
    });

    expect(scrollToSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ y: 0, animated: false });
  });
});
