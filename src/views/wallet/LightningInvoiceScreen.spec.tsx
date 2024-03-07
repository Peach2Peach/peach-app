/* eslint-disable no-magic-numbers */
import { render } from "test-utils";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { LightningInvoiceScreen } from "./LightningInvoiceScreen";

describe("LightningInvoiceScreen", () => {
  beforeEach(() => {
    setRouteMock<"lightningInvoice">({
      name: "lightningInvoice",
      key: "lightningInvoice",
      params: {
        invoice:
          "lnbc2342340n1pj7nshtdqqpp5zyldedlak8wpxaswd6kxpzxym86ptqul094262gdkdv7ppwqgsmsxqrrsssp583u3ue6vylycclcrj3q5944kj6cygay8p45xxsaza4l0lhhs2r2s9qrsgqcqzysrzjqtypre",
      },
    });
  });
  it("should render correctly", async () => {
    const { toJSON } = render(<LightningInvoiceScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
});
