import { fireEvent, render } from "test-utils";
import { Icon } from "../../Icon";
import { defaultState, useDrawerState } from "../useDrawerState";
import { GoBackIcon } from "./GoBackIcon";

jest.useFakeTimers();

describe("GoBackIcon", () => {
  const updateDrawer = useDrawerState.setState;
  beforeEach(() => {
    updateDrawer(defaultState);
  });
  it("renders correctly", () => {
    updateDrawer({
      previousDrawer: {
        title: "testTitle",
        content: "testContent",
        options: [],
        show: true,
        previousDrawer: undefined,
        onClose: jest.fn(),
      },
    });
    const { toJSON } = render(<GoBackIcon />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when there is no previous drawer", () => {
    const { toJSON } = render(<GoBackIcon />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should update the drawer to the previous drawer when pressed", () => {
    const previousDrawer = {
      title: "testTitle",
      content: "testContent",
      options: [],
      show: true,
      previousDrawer: undefined,
      onClose: jest.fn(),
    };
    updateDrawer({ previousDrawer });
    const { UNSAFE_getByType } = render(<GoBackIcon />);
    fireEvent.press(UNSAFE_getByType(Icon));
    expect(useDrawerState.getState().previousDrawer).toBeUndefined();
    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining(previousDrawer),
    );
  });
  it("should not update the drawer to the previous drawer when pressed if there is no previous drawer", () => {
    const { UNSAFE_getByType } = render(<GoBackIcon />);
    fireEvent.press(UNSAFE_getByType(Icon));
    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining(defaultState),
    );
  });
});
