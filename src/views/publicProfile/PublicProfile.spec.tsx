import { render, waitFor } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { PublicProfile } from "./PublicProfile";

jest.useFakeTimers();

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: jest.fn(() => ({ params: { userId: defaultUser.id } })),
}));

const DATE_TO_USE = new Date("2009-01-09");
jest.spyOn(global, "Date").mockImplementation(() => DATE_TO_USE);
Date.now = jest.fn(() => DATE_TO_USE.getTime());

describe("PublicProfile", () => {
  it("should render correctly when loading", () => {
    const { toJSON } = render(<PublicProfile />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when loaded", async () => {
    const { toJSON } = render(<PublicProfile />);

    await waitFor(() => {
      expect(queryClient.getQueryData(["user", defaultUser.id])).toEqual(
        defaultUser,
      );
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
