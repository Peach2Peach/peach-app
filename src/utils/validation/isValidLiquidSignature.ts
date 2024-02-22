import { Verifier } from 'bip322-liquid-js';

type Props = {
  message: string;
  address: string;
  signature: string;
};
export const isValidLiquidSignature = ({
  message,
  address,
  signature,
}: Props) => {
  try {
    return Verifier.verifySignature(address, message, signature)
  } catch (e) {
    console.log(e)
    return false
  }

}
