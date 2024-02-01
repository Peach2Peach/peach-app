import { createRenderer } from "react-test-renderer/shallow";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { RemotePaymentMethods } from "./RemotePaymentMethods";
import { validSEPAData } from "../../../tests/unit/data/paymentData";

describe("RemotePaymentMethods", () => {
  const renderer = createRenderer();

  it("should render correctly without methods", () => {
    renderer.render(
      <RemotePaymentMethods
        isEditing={false}
        editItem={jest.fn()}
        select={jest.fn()}
        isSelected={jest.fn(() => false)}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with methods", () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    renderer.render(
      <RemotePaymentMethods
        isEditing={false}
        editItem={jest.fn()}
        select={jest.fn()}
        isSelected={jest.fn(() => false)}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
