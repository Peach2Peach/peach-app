import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { AppState } from "react-native";
import { act, render, renderHook } from "test-utils";
import { Toast } from "../../components/toast/Toast";
import i18n from "../../utils/i18n";
import { useMessageHandler } from "./useMessageHandler";

const overlayEventHanderMock = jest.fn();
const overlayEvents = { overlayEvent: overlayEventHanderMock };
jest.mock("./eventHandler/useOverlayEvents");
jest
  .requireMock("./eventHandler/useOverlayEvents")
  .useOverlayEvents.mockReturnValue(overlayEvents);

const offerPopupEventHandlerMock = jest.fn();
const offerPopupEvents = { offerPopupEvent: offerPopupEventHandlerMock };
jest.mock("./eventHandler/offer/useOfferPopupEvents");
jest
  .requireMock("./eventHandler/offer/useOfferPopupEvents")
  .useOfferPopupEvents.mockReturnValue(offerPopupEvents);

const stateUpdateEventHandlerMock = jest.fn();
const stateUpdateEvents = { stateUpdateEvent: stateUpdateEventHandlerMock };
jest.mock("./eventHandler/useStateUpdateEvents");
jest
  .requireMock("./eventHandler/useStateUpdateEvents")
  .useStateUpdateEvents.mockReturnValue(stateUpdateEvents);

const actionMock = {
  label: "action",
  icon: "icon",
  callback: jest.fn(),
};
const getPNActionHandlerMock = jest.fn().mockReturnValue(actionMock);
jest.mock("./useGetPNActionHandler");
jest
  .requireMock("./useGetPNActionHandler")
  .useGetPNActionHandler.mockReturnValue(getPNActionHandlerMock);

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
    const { result: onMessageHandler } = renderHook(useMessageHandler);
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage);
    });

    expect(offerPopupEventHandlerMock).toHaveBeenCalledWith(
      mockRemoteMessage.data,
      mockRemoteMessage.notification,
    );
  });

  it("should call state update event when type is found in stateUpdateEvents", async () => {
    const mockRemoteMessage = {
      data: {
        type: "stateUpdateEvent",
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

    expect(stateUpdateEventHandlerMock).toHaveBeenCalledWith(
      mockRemoteMessage.data,
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
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(
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
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(
      mockRemoteMessage.data,
    );
    expect(toJSON()).toEqual(beforeUpdate);
  });
});
