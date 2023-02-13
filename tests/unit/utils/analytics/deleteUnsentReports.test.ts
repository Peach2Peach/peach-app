import { deleteUnsentReports } from '../../../../src/utils/analytics/deleteUnsentReports'
import { deleteUnsentReportsMock } from '../../prepare'

describe('deleteUnsentReports function', () => {
  it('should call the deleteUnsentReports method of the Crashlytics module', () => {
    deleteUnsentReports()
    expect(deleteUnsentReportsMock.mock.calls.length).toBe(1)
  })
})
