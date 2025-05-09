import { NETWORK } from "@env";
import { useQuery } from "@tanstack/react-query";
import { Address } from "bdk-rn";
import { Script } from "bdk-rn/lib/classes/Script";
import { Network } from "bdk-rn/lib/lib/enums";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { walletKeys } from "../hooks/useUTXOs";

type Props = {
  script: Script;
};

const useUTXOAddress = (script: Script) =>
  useQuery({
    queryKey: walletKeys.utxoAddress(script.id),
    queryFn: async () => {
      try {
        if (!peachWallet) throw new Error("Peach wallet not defined");
        const address = await new Address().fromScript(
          script,
          NETWORK as Network,
        );
        return await address.asString();
      } catch (e) {
        throw new Error("Error getting address");
      }
    },
    enabled: peachWallet !== null,
  });

export function UTXOAddress({ script }: Props) {
  const { data: address } = useUTXOAddress(script);
  const addressLabel = useWalletState((state) =>
    address ? state.addressLabelMap[address] : "",
  );

  return (
    <PeachText style={tw`body-s text-black-65`}>
      <PeachText style={tw`body-s`}>
        {addressLabel ? `${addressLabel} ‑ ` : ""}
      </PeachText>
      {address}
    </PeachText>
  );
}
