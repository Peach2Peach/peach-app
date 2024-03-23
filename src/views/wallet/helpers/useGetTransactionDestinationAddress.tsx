import { Transaction as BitcoinTransaction } from "bitcoinjs-lib";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { useAreMyAddresses } from "../../../hooks/wallet/useIsMyAddress";
import { getAddressesFromOutputs } from "./getAddressesFromOutputs";

type Props = Pick<BitcoinTransaction | LiquidTransaction, "outs"> & {
  incoming: boolean;
  chain: "bitcoin" | "liquid";
};

export const useGetTransactionDestinationAddress = ({
  outs = [],
  incoming,
  chain,
}: Props) => {
  const addresses = getAddressesFromOutputs({ outs, chain });
  const areMine = useAreMyAddresses({ addresses, chain });

  if (addresses.length === 1) return addresses[0];

  const destinationAddress = addresses.find((a, i) =>
    incoming ? areMine[i] : !areMine[i],
  );
  return destinationAddress;
};
