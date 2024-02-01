import { render } from "test-utils";
import { SummaryItem } from "./SummaryItem";

describe("SummaryItem", () => {
  it("should render correctly for really long IBANs", () => {
    const { toJSON } = render(
      <SummaryItem
        label="IBAN"
        value={
          <SummaryItem.Text value="NL91 ABNA 0417 1643 0099 7511 99" copyable />
        }
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
