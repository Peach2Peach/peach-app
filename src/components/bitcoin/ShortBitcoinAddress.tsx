import "react-native-url-polyfill/auto";
import tw from "../../styles/tailwind";
import { getBitcoinAddressParts } from "../../utils/bitcoin/getBitcoinAddressParts";
import { PeachText } from "../text/PeachText";

const getAddressParts = (address: string) => {
  const addressParts = getBitcoinAddressParts(address);
  addressParts.three = `${addressParts.three[0]} ... ${addressParts.three[addressParts.three.length - 1]}`;
  return addressParts;
};

type ShortBitcoinAddressProps = ComponentProps & {
  address: string;
};

export const ShortBitcoinAddress = ({
  address,
  style,
}: ShortBitcoinAddressProps) => {
  const addressParts = getAddressParts(address);

  return (
    <PeachText style={[tw`text-black-10`, style]}>
      {addressParts.one}
      <PeachText style={[tw`text-black-100`, style]}>
        {addressParts.two}
      </PeachText>
      {addressParts.three}
      <PeachText style={[tw`text-black-100`, style]}>
        {addressParts.four}
      </PeachText>
    </PeachText>
  );
};
