const logAppOpenMock = jest.fn();
const logScreenViewMock = jest.fn();
const setAnalyticsCollectionEnabledMock = jest.fn();
const logEventMock = jest.fn();

export default () => ({
  logAppOpen: logAppOpenMock,
  logScreenView: logScreenViewMock,
  setAnalyticsCollectionEnabled: setAnalyticsCollectionEnabledMock,
  logEvent: logEventMock,
});
