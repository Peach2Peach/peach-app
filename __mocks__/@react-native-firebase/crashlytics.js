const deleteUnsentReportsMock = jest.fn();
const logMock = jest.fn();
const recordErrorMock = jest.fn();
export default () => ({
  deleteUnsentReports: deleteUnsentReportsMock,
  log: logMock,
  recordError: recordErrorMock,
});
