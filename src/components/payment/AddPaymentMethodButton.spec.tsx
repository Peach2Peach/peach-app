import { fireEvent, render, responseUtils, waitFor } from "test-utils";
import { BitcoinEvent } from "../../../peach-api/src/@types/events";
import {
  belgianBTCEmbassy,
  breizhBitcoin,
  btcPrague,
  decouvreBTC,
} from "../../../tests/unit/data/eventData";
import {
  navigateMock,
  pushMock,
  setRouteMock,
} from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { defaultState, useDrawerState } from "../drawer/useDrawerState";
import { AddPaymentMethodButton } from "./AddPaymentMethodButton";

const mockEvents: BitcoinEvent[] = [belgianBTCEmbassy, decouvreBTC];

const getEventsSpy = jest
  .spyOn(peachAPI.public.events, "getEvents")
  .mockResolvedValue({ result: mockEvents, ...responseUtils });

jest.useFakeTimers();

describe("AddPaymentMethodButton", () => {
  beforeAll(() => {
    setRouteMock({ name: "paymentMethods", key: "paymentMethods" });
  });
  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly", () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should render correctly with isCash", async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />);
    await waitFor(async () => {
      expect(queryClient.isFetching()).toBe(0);
      await jest.runAllTimersAsync();
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it("should render correctly with isCash while still loading", async () => {
    const { toJSON } = render(<AddPaymentMethodButton isCash />);
    expect(toJSON()).toMatchSnapshot();
    expect(queryClient.isFetching()).toBe(1);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
  });

  it("should not update the drawer if meetupEvents are undefined", async () => {
    getEventsSpy.mockResolvedValueOnce({
      result: undefined,
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("add new cash option"));
    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining(defaultState),
    );
  });

  it("should update the drawer with the right parameters for cash trades", async () => {
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("add new cash option"));
    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining({
        title: "select country",
        show: true,
        options: expect.arrayContaining([
          { flagID: "BE", onPress: expect.anything(), title: "Belgium" },
          { flagID: "FR", onPress: expect.anything(), title: "France" },
        ]),
      }),
    );
  });

  it("should show the meetup select drawer after selecting a country", () => {
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    fireEvent.press(getByText("add new cash option"));
    const onPress = useDrawerState
      .getState()
      .options.find((e) => e.title === "Belgium")?.onPress;
    onPress?.();

    expect(useDrawerState.getState()).toStrictEqual(
      expect.objectContaining({
        title: "select meetup",
        show: true,
        options: expect.arrayContaining([
          {
            highlighted: false,
            onPress: expect.any(Function),
            subtext: "Antwerp",
            title: "Belgian Bitcoin Embassy",
          },
        ]),
        previousDrawer: expect.objectContaining({
          title: "select country",
          show: true,
          options: expect.arrayContaining([
            { flagID: "BE", onPress: expect.any(Function), title: "Belgium" },
            { flagID: "FR", onPress: expect.any(Function), title: "France" },
          ]),
        }),
      }),
    );
  });

  it("should navigate to the meetupScreen with the right parameters", () => {
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    fireEvent.press(getByText("add new cash option"));
    const onBelgiumPress = useDrawerState
      .getState()
      .options.find((e) => e.title === "Belgium")?.onPress;
    onBelgiumPress?.();

    const onBelgianBTCEmbassyPress = useDrawerState
      .getState()
      .options.find((e) => e.title === belgianBTCEmbassy.longName)?.onPress;
    onBelgianBTCEmbassyPress?.();

    expect(useDrawerState.getState().show).toBe(false);
    expect(pushMock).toHaveBeenCalledWith("meetupScreen", {
      eventId: belgianBTCEmbassy.id,
      origin: "paymentMethods",
    });
  });
  it("should navigate to the addPaymentMethod screen with the right parameters for isCash false", () => {
    const { getByText } = render(<AddPaymentMethodButton isCash={false} />);
    fireEvent.press(getByText("add new currency /\npayment method"));
    expect(navigateMock).toHaveBeenCalledWith("selectCurrency", {
      origin: "paymentMethods",
    });
  });
  it("should sort the countries alphabetically and keep super featured events on top", async () => {
    getEventsSpy.mockResolvedValueOnce({
      result: [...mockEvents, btcPrague],
      ...responseUtils,
    });
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("add new cash option"));
    expect(useDrawerState.getState().options).toStrictEqual(
      expect.arrayContaining([
        {
          highlighted: true,
          onPress: expect.any(Function),
          subtext: "Prague",
          title: "BTC Prague",
        },
        { flagID: "BE", onPress: expect.any(Function), title: "Belgium" },
        { flagID: "FR", onPress: expect.any(Function), title: "France" },
        {
          flagID: "CZ",
          onPress: expect.any(Function),
          title: "Czech Republic",
        },
      ]),
    );
  });
  it("should sort the meetups by their city alphabetically", async () => {
    getEventsSpy.mockResolvedValueOnce({
      result: [breizhBitcoin, ...mockEvents],
      ...responseUtils,
    });
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("add new cash option"));

    const onPress = useDrawerState
      .getState()
      .options.find((e) => e.title === "France")?.onPress;
    onPress?.();

    expect(useDrawerState.getState().options).toStrictEqual([
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: decouvreBTC.city,
        title: decouvreBTC.longName,
      },
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: breizhBitcoin.city,
        title: breizhBitcoin.longName,
      },
    ]);
  });

  it("should show the featured meetups at the top of the list", async () => {
    const featuredEvent: BitcoinEvent = {
      ...breizhBitcoin,
      featured: true,
    };
    getEventsSpy.mockResolvedValueOnce({
      result: [decouvreBTC, featuredEvent],
      ...responseUtils,
    });
    const { getByText } = render(<AddPaymentMethodButton isCash />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("add new cash option"));

    const onPress = useDrawerState
      .getState()
      .options.find((e) => e.title === "France")?.onPress;
    onPress?.();

    expect(useDrawerState.getState().options).toStrictEqual([
      {
        highlighted: true,
        onPress: expect.any(Function),
        subtext: featuredEvent.city,
        title: featuredEvent.longName,
      },
      {
        highlighted: false,
        onPress: expect.any(Function),
        subtext: decouvreBTC.city,
        title: decouvreBTC.longName,
      },
    ]);
  });
});
