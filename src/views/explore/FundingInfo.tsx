import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function FundingInfo({
  fundingStatus,
}: {
  fundingStatus: FundingStatus["status"];
}) {
  return (
    <View style={tw`flex-row items-center gap-10px`}>
      <Icon id="lock" size={32} color={tw.color("black-100")} />
      {fundingStatus === "FUNDED" ? (
        <PeachText style={tw`leading-loose underline subtitle-0`}>
          {i18n("offer.sell.satsInEscrow")}
        </PeachText>
      ) : (
        <>
          {fundingStatus === "MEMPOOL" ? (
            <PeachText style={tw`leading-loose underline subtitle-0`}>
              {i18n("offer.sell.satsInMempool")}
            </PeachText>
          ) : (
            <PeachText style={tw`leading-loose underline subtitle-0`}>
              {i18n("offer.sell.satsNotInEscrow")}
            </PeachText>
          )}
        </>
      )}
    </View>
  );
}
