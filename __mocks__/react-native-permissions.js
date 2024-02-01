export const checkNotifications = jest.fn();
export const PERMISSIONS = {
  IOS: {
    NOTIFICATIONS: "ios.permission.NOTIFICATIONS",
    CAMERA: "ios.permission.CAMERA",
  },
};

export const RESULTS = Object.freeze({
  UNAVAILABLE: "unavailable",
  BLOCKED: "blocked",
  DENIED: "denied",
  GRANTED: "granted",
  LIMITED: "limited",
});

export const request = jest.fn().mockImplementation((permission) => {
  switch (permission) {
    case PERMISSIONS.IOS.NOTIFICATIONS:
      return Promise.resolve(RESULTS.GRANTED);
    case PERMISSIONS.IOS.CAMERA:
      return Promise.resolve(RESULTS.GRANTED);
    default:
      return Promise.resolve(RESULTS.UNAVAILABLE);
  }
});

export default {
  PERMISSIONS,
  RESULTS,
  checkNotifications,
  request,
};
