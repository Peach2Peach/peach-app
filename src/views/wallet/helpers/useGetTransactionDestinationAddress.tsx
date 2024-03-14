import {
  Transaction as BitcoinTransaction,
  address as bitcoinAddress,
} from "bitcoinjs-lib";
import {
  Transaction as LiquidTransaction,
  address as liquidAddress,
} from "liquidjs-lib";
import { useAreMyAddresses } from "../../../hooks/wallet/useIsMyAddress";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { getNetwork } from "../../../utils/wallet/getNetwork";

type Props = Pick<BitcoinTransaction | LiquidTransaction, "outs"> & {
  incoming: boolean;
  chain: "bitcoin" | "liquid";
};

export const useGetTransactionDestinationAddress = ({
  outs = [],
  incoming,
  chain,
}: Props) => {
  const addresses = outs
    .map((v) => v.script)
    .filter((script) => script.byteLength)
    .map((script) =>
      chain === "bitcoin"
        ? bitcoinAddress.fromOutputScript(script, getNetwork())
        : liquidAddress.fromOutputScript(script, getLiquidNetwork()),
    );

  const areMine = useAreMyAddresses(addresses, chain);

  if (addresses.length === 1) return addresses[0];

  const destinationAddress = addresses.find((a, i) =>
    incoming ? areMine[i] : !areMine[i],
  );
  return destinationAddress;
};
