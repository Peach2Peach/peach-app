import { Descriptor, KeychainKind } from "bdk-rn";
import { bdkNetworkKind } from "./bdkShim";
import { getDescriptorSecretKey } from "./getDescriptorSecretKey";

type Props = {
  seedphrase?: string;
  network: string;
};

export const getDescriptorsBySeedphrase = ({ seedphrase, network }: Props) => {
  const descriptorSecretKey = getDescriptorSecretKey(network, seedphrase);
  const networkKind = bdkNetworkKind(network);
  const externalDescriptor = Descriptor.newBip84(
    descriptorSecretKey,
    KeychainKind.External,
    networkKind,
  );
  const internalDescriptor = Descriptor.newBip84(
    descriptorSecretKey,
    KeychainKind.Internal,
    networkKind,
  );

  return { externalDescriptor, internalDescriptor };
};
