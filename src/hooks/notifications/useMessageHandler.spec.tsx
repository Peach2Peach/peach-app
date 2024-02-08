import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { AppState } from "react-native";
import { act, render, renderHook } from "test-utils";
import { Toast } from "../../components/toast/Toast";
import i18n from "../../utils/i18n";
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

jest.useFakeTimers();

describe("useMessageHandler", () => {
  it("should call updateMessage when type is not found", async () => {
    const mockRemoteMessage = {
      data: {
        type: "SOME_TYPE",
      },
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage;
    const { queryByText } = render(<Toast />);
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    AppState.currentState = "active";
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(
      queryByText(i18n("notification.SOME_TYPE", "arg1", "arg2")),
    ).toBeTruthy();
  });
  it("should not call updateMessage when type is not found and appstate is background", async () => {
    const mockRemoteMessage = {
      data: {
        type: "SOME_TYPE",
      },
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage;
    const { queryByText } = render(<Toast />);
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    AppState.currentState = "background";

    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(
      queryByText(i18n("notification.SOME_TYPE.text", "arg1", "arg2")),
    ).toBeFalsy();
  });

  it("should call overlay event when type is found in overlayEvents", async () => {
    const mockRemoteMessage = {
      data: {
        type: "overlayEvent",
      },
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
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
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage;

    AppState.currentState = "active";

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
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
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
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
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
      notification: {
        bodyLocArgs: ["arg1", "arg2"],
      },
      fcmOptions: {},
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
