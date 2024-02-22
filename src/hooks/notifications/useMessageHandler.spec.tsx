import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { AppState } from "react-native";
import { act, render, renderHook, waitFor } from "test-utils";
import { Toast } from "../../components/toast/Toast";
import { tolgee } from "../../tolgee";
import { useMessageHandler } from "./useMessageHandler";

const overlayEventHanderMock = jest.fn();
const mockOverlayEvents = { overlayEvent: overlayEventHanderMock };
jest.mock("./eventHandler/useOverlayEvents", () => ({
  useOverlayEvents: () => mockOverlayEvents,
}));

const offerPopupEventHandlerMock = jest.fn();
const mockOfferPopupEvents = { offerPopupEvent: offerPopupEventHandlerMock };
jest.mock("./eventHandler/offer/useOfferPopupEvents", () => ({
  useOfferPopupEvents: () => mockOfferPopupEvents,
}));

const mockGetPNActionHandler = jest.fn().mockReturnValue({
  label: "action",
  icon: "icon",
  callback: jest.fn(),
});
jest.mock("./useGetPNActionHandler", () => ({
  useGetPNActionHandler: () => mockGetPNActionHandler,
}));

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getInitialNotification: jest.fn().mockResolvedValue(null),
  })),
}));

jest.useFakeTimers();

describe("useMessageHandler", () => {
  const notificationBase = {
    notifcation: {
      bodyLocArgs: ["arg1", "arg2"],
    },
    fcmOptions: {},
    messageId: "messageId",
  };
  beforeEach(() => {
    AppState.currentState = "active";
  });
  it("should call updateMessage when type is not found", async () => {
    const mockRemoteMessage = {
      data: {
        type: "SOME_TYPE",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { queryByText } = render(<Toast />);
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(
      queryByText(
        // @ts-ignore
        tolgee.t("notification.SOME_TYPE", { param1: "arg1", param2: "arg2" }),
      ),
    ).toBeTruthy();
    await waitFor(() => {
      jest.runAllTimers();
    });
  });
  it("should not call updateMessage when type is not found and appstate is background", async () => {
    const mockRemoteMessage = {
      data: {
        type: "SOME_TYPE",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { queryByText } = render(<Toast />);
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    AppState.currentState = "background";

    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(
      queryByText(
        // @ts-ignore
        tolgee.t("notification.SOME_TYPE.text", {
          param1: "arg1",
          param2: "arg2",
        }),
      ),
    ).toBeFalsy();

    await waitFor(() => {
      jest.runAllTimers();
    });
  });
  it("should not call updateMessage when type is not found but the notification is the initial notification", async () => {
    const mockRemoteMessage = {
      data: {
        type: "SOME_TYPE",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { queryByText } = render(<Toast />);
    expect(
      queryByText(
        // @ts-ignore
        tolgee.t("notification.SOME_TYPE", { param1: "arg1", param2: "arg2" }),
      ),
    ).toBeFalsy();
    jest
      .spyOn(jest.requireMock("@react-native-firebase/messaging"), "default")
      .mockReturnValueOnce({
        getInitialNotification: jest.fn().mockResolvedValue(mockRemoteMessage),
      });
    const { result } = renderHook(useMessageHandler);
    await act(async () => {
      await result.current(mockRemoteMessage);
    });

    expect(
      queryByText(
        // @ts-ignore
        tolgee.t("notification.SOME_TYPE", { param1: "arg1", param2: "arg2" }),
      ),
    ).toBeFalsy();
  });

  it("should call overlay event when type is found in overlayEvents", async () => {
    const mockRemoteMessage = {
      data: {
        type: "overlayEvent",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(overlayEventHanderMock).toHaveBeenCalledWith(mockRemoteMessage.data);
  });

  it("should call popup event when type is found in offerPopupEvents", async () => {
    const mockRemoteMessage = {
      data: {
        type: "offerPopupEvent",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;

    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(offerPopupEventHandlerMock).toHaveBeenCalledWith(
      mockRemoteMessage.data,
      mockRemoteMessage.notification,
    );
  });

  it("should not call popup event when type is found in offerPopupEvents and appstate is background", async () => {
    const mockRemoteMessage = {
      data: {
        type: "offerPopupEvent",
      },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;

    AppState.currentState = "background";

    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
      mockRemoteMessage.notification,
    );
  });

  it("should not call anything when data is undefined", async () => {
    const mockRemoteMessage = {
      data: undefined,
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { toJSON } = render(<Toast />);
    const beforeUpdate = toJSON();
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
    );
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
    );
    expect(toJSON()).toEqual(beforeUpdate);
  });

  it("should not call anything when type is undefined", async () => {
    const mockRemoteMessage = {
      data: { someOtherData: "someOtherData" },
      ...notificationBase,
    } as FirebaseMessagingTypes.RemoteMessage;
    const { toJSON } = render(<Toast />);
    const beforeUpdate = toJSON();
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
    );
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
    );
    expect(toJSON()).toEqual(beforeUpdate);
  });
});
