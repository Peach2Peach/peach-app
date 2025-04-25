import { NETWORK } from "@env";
import { TouchableOpacity } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { showAddress } from "../../utils/bitcoin/showAddress";

export function FundingInfo({
  escrow,
  fundingStatus,
}: {
  escrow: string;
  fundingStatus: FundingStatus["status"];
}) {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between gap-10px`}
      onPress={() => showAddress(escrow, NETWORK)}
    >
      <Icon id="lock" size={32} color={tw.color("black-100")} />
      {fundingStatus === "FUNDED" ? (
        <PeachText style={tw`leading-loose underline grow subtitle-0`}>
          sats are in escrow
        </PeachText>
      ) : (
        <>
          {fundingStatus === "MEMPOOL" ? (
            <PeachText style={tw`leading-loose underline grow subtitle-0`}>
              sats are in mempool
            </PeachText>
          ) : (
            <PeachText style={tw`leading-loose underline grow subtitle-0`}>
              sats are not in escrow
            </PeachText>
          )}
        </>
      )}
      <Icon id="externalLink" size={20} color={tw.color("primary-main")} />
    </TouchableOpacity>
  );
}
