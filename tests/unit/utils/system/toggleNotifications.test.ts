import { toggleNotifications } from '../../../../src/utils/system/toggleNotifications'
import { toggleNotificationsAndroid } from '../../../../src/utils/system/toggleNotificationsAndroid'
import { toggleNotificationsIOS } from '../../../../src/utils/system/toggleNotificationsIOS'
import { isIOS } from '../../../../src/utils/system/isIOS'

jest.mock('../../../../src/utils/system/toggleNotificationsAndroid')
jest.mock('../../../../src/utils/system/toggleNotificationsIOS')
jest.mock('../../../../src/utils/system/isIOS')

describe('toggleNotifications', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls toggleNotificationsIOS if isIOS returns true', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(true)
    await toggleNotifications()
    expect(toggleNotificationsIOS).toHaveBeenCalled()
    expect(toggleNotificationsAndroid).not.toHaveBeenCalled()
  })

  it('calls toggleNotificationsAndroid if isIOS returns false', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(false)
    await toggleNotifications()
    expect(toggleNotificationsAndroid).toHaveBeenCalled()
    expect(toggleNotificationsIOS).not.toHaveBeenCalled()
  })
})
