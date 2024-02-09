import { Descriptor } from "bdk-rn";
import { KeychainKind, Network } from "bdk-rn/lib/lib/enums";
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
  const [externalDescriptor, internalDescriptor] = await Promise.all([
    new Descriptor().newBip84(
      descriptorSecretKey,
      KeychainKind.External,
      network,
    ),
    new Descriptor().newBip84(
      descriptorSecretKey,
      KeychainKind.Internal,
      network,
    ),
  ]);

  return { externalDescriptor, internalDescriptor };
};
