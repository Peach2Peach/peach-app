import { Verifier } from "bip322-js";
import { Network, networks } from "bitcoinjs-lib";
import { verify } from "bitcoinjs-message";

type Props = {
  message: string;
  address: string;
  signature: string;
  network?: Network;
};
export const isValidBitcoinSignature = ({
  message,
  address,
  signature,
  network = networks.bitcoin,
}: Props) => {
  try {
    if (verify(message, address, signature)) return true;
  } catch (e) {
    // continue
  }
  try {
    return Verifier.verifySignature(address, message, signature, network);
  } catch (e2) {
    return false;
  }
};
