import { peachInfo } from '../../tests/unit/data/peachInfoData'
import { useConfigStore } from '../store/configStore/configStore'
import { storePeachInfo } from './storePeachInfo'

describe('storePeachInfo', () => {
  it('stores peach info', () => {
    storePeachInfo(peachInfo)
    expect(useConfigStore.getState().paymentMethods).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'sepa',
          currencies: ['EUR'],
          anonymous: false,
        }),
      ]),
    )
    expect(useConfigStore.getState().latestAppVersion).toStrictEqual(peachInfo.latestAppVersion)
    expect(useConfigStore.getState().minAppVersion).toStrictEqual(peachInfo.minAppVersion)
    expect(useConfigStore.getState().peachFee).toStrictEqual(peachInfo.fees.escrow)
    expect(useConfigStore.getState().peachPGPPublicKey).toStrictEqual(peachInfo.peach.pgpPublicKey)
  })
})
