const requestPermissionMock = jest.fn();
const hasPermissionMock = jest.fn();

const messaging = jest.fn(() => ({
  requestPermission: requestPermissionMock,
  hasPermission: hasPermissionMock,
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  getToken: jest.fn(() => "testMessagingToken"),
}));

messaging.AuthorizationStatus = {
  NOT_DETERMINED: -1,
  AUTHORIZED: 1,
  DENIED: 0,
  PROVISIONAL: 2,
};

export default messaging;
