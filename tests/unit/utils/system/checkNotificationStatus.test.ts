import { checkNotificationStatus } from '../../../../src/utils/system/checkNotificationStatus'
import { checkNotificationStatusAndroid } from '../../../../src/utils/system/checkNotificationStatusAndroid'
import { checkNotificationStatusIOS } from '../../../../src/utils/system/checkNotificationStatusIOS'
import { isIOS } from '../../../../src/utils/system/isIOS'

jest.mock('../../../../src/utils/system/checkNotificationStatusAndroid')
jest.mock('../../../../src/utils/system/checkNotificationStatusIOS')
jest.mock('../../../../src/utils/system/isIOS')

describe('checkNotificationStatus', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls checkNotificationStatusIOS if isIOS returns true', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(true)
    await checkNotificationStatus()
    expect(checkNotificationStatusIOS).toHaveBeenCalled()
    expect(checkNotificationStatusAndroid).not.toHaveBeenCalled()
  })

  it('calls checkNotificationStatusAndroid if isIOS returns false', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(false)
    await checkNotificationStatus()
    expect(checkNotificationStatusAndroid).toHaveBeenCalled()
    expect(checkNotificationStatusIOS).not.toHaveBeenCalled()
  })
})
