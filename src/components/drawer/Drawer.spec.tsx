import { BackHandler, Text } from "react-native";
import { act, render } from "test-utils";
import { Drawer } from "./Drawer";
import { useDrawerState } from "./useDrawerState";

const onCloseMock = jest.fn();
const defaultState: DrawerState = {
  title: "testTitle",
  content: <Text>Drawer content</Text>,
  options: [],
  show: true,
  previousDrawer: undefined,
  onClose: onCloseMock,
};

jest.mock("react-native/Libraries/Utilities/BackHandler", () =>
  jest.requireActual(
    "react-native/Libraries/Utilities/__mocks__/BackHandler.js",
  ),
);

jest.useFakeTimers();

describe("Drawer", () => {
  const updateDrawer = useDrawerState.setState;

  beforeEach(() => {
    updateDrawer(defaultState);
  });
  it("should close the drawer and call onClose on hardware back press", () => {
    render(<Drawer />);

    expect(useDrawerState.getState().show).toBe(true);

    act(() => {
      // @ts-expect-error it works for testing
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });
    expect(BackHandler.exitApp).not.toHaveBeenCalled();
    expect(useDrawerState.getState().show).toBe(false);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
  it("should show the previous drawer on hardware back press if it exists", () => {
    updateDrawer({
      ...defaultState,
      previousDrawer: {
        ...defaultState,
        title: "previousDrawerTitle",
      },
    });
    render(<Drawer />);

    act(() => {
      // @ts-expect-error it works for testing
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });
    expect(useDrawerState.getState().show).toBe(true);
    expect(onCloseMock).toHaveBeenCalledTimes(0);
    expect(useDrawerState.getState().previousDrawer).toEqual(undefined);
    expect(useDrawerState.getState().title).toBe("previousDrawerTitle");
  });
  it("should perform default action on hardware back press when drawer is not shown", () => {
    updateDrawer({ ...defaultState, show: false });
    render(<Drawer />);

    act(() => {
      // @ts-expect-error it works for testing
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });

    // `exitApp` in this case is the default action
    expect(BackHandler.exitApp).toHaveBeenCalled();
  });
});
