import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import i18n from "../../utils/i18n";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import {
  defaultNodeConfig,
  useNodeConfigState,
} from "../../utils/wallet/nodeConfigStore";
import { setPeachWallet } from "../../utils/wallet/setWallet";
import { NodeSetup } from "./NodeSetup";
expect.extend({ toMatchDiffSnapshot });

jest.mock("./helpers/checkNodeConnection");
jest.useFakeTimers();

const url = "blockstream.info";
describe("NodeSetup", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  beforeEach(() => {
    useNodeConfigState.setState(defaultNodeConfig);
  });
  it("should toggle enabled", () => {
    const { getAllByText, toJSON } = render(<NodeSetup />);
    const beforeToggle = toJSON();
    fireEvent.press(getAllByText("use your own node")[1]);
    const afterToggle = toJSON();
    expect(afterToggle).toMatchDiffSnapshot(beforeToggle);
  });
  it("should not be able to toggle ssl if disabled", () => {
    useNodeConfigState.setState({ enabled: false });
    const { getByText, toJSON } = render(<NodeSetup />);
    const beforeToggle = toJSON();
    fireEvent.press(getByText("use SSL"));
    const afterToggle = toJSON();
    expect(beforeToggle).toStrictEqual(afterToggle);
  });
  it("should toggle ssl", () => {
    useNodeConfigState.setState({ enabled: true });
    const { getByText, toJSON } = render(<NodeSetup />);
    const beforeToggle = toJSON();
    fireEvent.press(getByText("use SSL"));
    const afterToggle = toJSON();
    expect(afterToggle).toMatchDiffSnapshot(beforeToggle);
  });
  it("should change address", () => {
    useNodeConfigState.setState({ enabled: true });
    const { getByPlaceholderText, toJSON } = render(<NodeSetup />);
    const beforeInput = toJSON();
    fireEvent(getByPlaceholderText("192.168.0.1:50001"), "onChangeText", url);
    const afterInput = toJSON();

    expect(afterInput).toMatchDiffSnapshot(beforeInput);
  });
  it("should open help popup", () => {
    const { getByAccessibilityHint, queryByText } = render(
      <>
        <NodeSetup />
        <GlobalPopup />
      </>,
    );

    fireEvent.press(getByAccessibilityHint("help use your own node"));
    expect(queryByText(i18n("help.useYourOwnNode.description"))).toBeTruthy();
  });
});
