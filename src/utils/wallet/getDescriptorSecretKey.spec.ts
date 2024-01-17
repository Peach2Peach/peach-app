import { Mnemonic } from 'bdk-rn'
import { Network } from 'bdk-rn/lib/lib/enums'
import { account1 } from '../../../tests/unit/data/accountData'
import {
  descriptorSecretKeyCreateMock,
  mnemonicCreateMock,
  mnemonicFromStringMock,
} from '../../../tests/unit/mocks/bdkRN'
import { getDescriptorSecretKey } from './getDescriptorSecretKey'

describe('getDescriptorSecretKey', () => {
  it('creates new random descriptor secret', async () => {
    const mnemonic = await new Mnemonic().create()
    mnemonicCreateMock.mockReturnValueOnce(mnemonic)
    await getDescriptorSecretKey(Network.Bitcoin)
    expect(descriptorSecretKeyCreateMock).toHaveBeenCalledWith(Network.Bitcoin, mnemonic)
  })
  it('loads wallet with seed', async () => {
    const mnemonic = await new Mnemonic().create()
    mnemonicFromStringMock.mockReturnValueOnce(mnemonic)

    await getDescriptorSecretKey(Network.Bitcoin, account1.mnemonic)
    expect(mnemonicFromStringMock).toHaveBeenCalledWith(account1.mnemonic)
    expect(descriptorSecretKeyCreateMock).toHaveBeenCalledWith(Network.Bitcoin, mnemonic)
  })
})
