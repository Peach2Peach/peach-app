import { Descriptor, DescriptorSecretKey } from 'bdk-rn'
import { KeychainKind, Network } from 'bdk-rn/lib/lib/enums'
import { DescriptorNewBip84Mock } from '../../../tests/unit/mocks/bdkRN'
import { getDescriptorsBySeedphrase } from './getDescriptorsBySeedphrase'

const getDescriptorSecretKeyMock = jest.fn()
jest.mock('./getDescriptorSecretKey', () => ({
  getDescriptorSecretKey: (...args: unknown[]) => getDescriptorSecretKeyMock(...args),
}))

describe('getDescriptorsBySeedphrase', () => {
  const seedphrase = 'mom mom mom mom mom mom mom mom mom mom mom mom'
  const network = Network.Bitcoin
  it('should return external and internal descriptors', async () => {
    const descriptorSecret = new DescriptorSecretKey()
    getDescriptorSecretKeyMock.mockResolvedValue(descriptorSecret)
    const expectedExternalDescriptor = await new Descriptor().newBip84(descriptorSecret, KeychainKind.External, network)
    const expectedInternalDescriptor = await new Descriptor().newBip84(descriptorSecret, KeychainKind.Internal, network)
    DescriptorNewBip84Mock.mockImplementation((secret, keychain) => {
      if (keychain === KeychainKind.External) return expectedExternalDescriptor
      if (keychain === KeychainKind.Internal) return expectedInternalDescriptor
    })
    const { externalDescriptor, internalDescriptor } = await getDescriptorsBySeedphrase({
      seedphrase,
      network,
    })
    expect(externalDescriptor).toEqual(expectedExternalDescriptor)
    expect(internalDescriptor).toEqual(expectedInternalDescriptor)
  })
})
