import { linkToAppStore } from '../../../../src/utils/system/linkToAppStore'
import { linkToAppStoreAndroid } from '../../../../src/utils/system/linkToAppStoreAndroid'
import { linkToAppStoreIOS } from '../../../../src/utils/system/linkToAppStoreIOS'
import { isIOS } from '../../../../src/utils/system/isIOS'

jest.mock('../../../../src/utils/system/linkToAppStoreAndroid')
jest.mock('../../../../src/utils/system/linkToAppStoreIOS')
jest.mock('../../../../src/utils/system/isIOS')

describe('linkToAppStore', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls linkToAppStoreIOS if isIOS returns true', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(true)
    await linkToAppStore()
    expect(linkToAppStoreIOS).toHaveBeenCalled()
    expect(linkToAppStoreAndroid).not.toHaveBeenCalled()
  })

  it('calls linkToAppStoreAndroid if isIOS returns false', async () => {
    ;(<jest.Mock>isIOS).mockReturnValueOnce(false)
    await linkToAppStore()
    expect(linkToAppStoreAndroid).toHaveBeenCalled()
    expect(linkToAppStoreIOS).not.toHaveBeenCalled()
  })
})
