import { render, waitFor } from "test-utils";
import { defaultUser } from "../../../../peach-api/src/testData/userData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { MyProfile } from "./MyProfile";

jest.useFakeTimers();
const DATE_TO_USE = new Date("2009-09-01");
jest.spyOn(global, "Date").mockImplementation(() => DATE_TO_USE);
Date.now = jest.fn(() => DATE_TO_USE.getTime());

describe("MyProfile", () => {
  it("should render correctly", async () => {
    const { toJSON } = render(<MyProfile />);

    await waitFor(() => {
      expect(queryClient.getQueryData(["user", "self"])).toEqual(defaultUser);
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
