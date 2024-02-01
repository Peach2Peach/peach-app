import { View } from "react-native";
import { render } from "test-utils";
import { mockDimensions } from "../../tests/unit/helpers/mockDimensions";
import { Screen } from "./Screen";

describe("Screen", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <Screen>
        <View />
      </Screen>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly on small screens", () => {
    mockDimensions({ width: 320, height: 480 });
    const { toJSON } = render(
      <Screen>
        <View />
      </Screen>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
