const deleteUnsentReportsMock = jest.fn();
const logMock = jest.fn();
const recordErrorMock = jest.fn();
const setCrashlyticsCollectionEnabledMock = jest.fn();
export default () => ({
  deleteUnsentReports: deleteUnsentReportsMock,
  log: logMock,
  recordError: recordErrorMock,
  setCrashlyticsCollectionEnabled: setCrashlyticsCollectionEnabledMock,
});
