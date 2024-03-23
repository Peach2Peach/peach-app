import { render } from "test-utils";
import { account1 } from "../../../tests/unit/data/accountData";
import { TransactionBatching } from "./TransactionBatching";

jest.mock("../../hooks/query/useSelfUser");
const useSelfUserMock = jest
  .requireMock("../../hooks/query/useSelfUser")
  .useSelfUser.mockReturnValue({
    user: account1,
    isLoading: false,
  });
describe("TransactionBatching", () => {
  it("should render correctly while loading", () => {
    useSelfUserMock.mockReturnValue({ isLoading: true });
    const { toJSON } = render(<TransactionBatching />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly", () => {
    const { toJSON } = render(<TransactionBatching />);
    expect(toJSON()).toMatchSnapshot();
  });
});
