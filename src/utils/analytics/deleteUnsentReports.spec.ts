import { deleteUnsentReports } from './deleteUnsentReports'
import { deleteUnsentReportsMock } from '../../../tests/unit/prepare'

describe('deleteUnsentReports function', () => {
  it('should call the deleteUnsentReports method of the Crashlytics module', () => {
    deleteUnsentReports()
    expect(deleteUnsentReportsMock.mock.calls.length).toBe(1)
  })
})
