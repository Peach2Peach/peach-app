import { Descriptor, KeychainKind, Network } from "bdk-rn";
import { getDescriptorSecretKey } from "./getDescriptorSecretKey";

type Props = {
  seedphrase?: string;
  network: Network;
};
export const getDescriptorsBySeedphrase = async ({
  seedphrase,
  network,
}: Props) => {
  const descriptorSecretKey = await getDescriptorSecretKey(network, seedphrase);

  const externalDescriptor = Descriptor.newBip84(descriptorSecretKey, KeychainKind.External, network)
  const internalDescriptor = Descriptor.newBip84(descriptorSecretKey, KeychainKind.Internal, network)

  return { externalDescriptor, internalDescriptor };
};
