import { Fragment } from "react";
import { TouchableOpacity, View } from "react-native";
import { InfoPopup } from "../../../popups/InfoPopup";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { badges } from "../../../views/settings/profile/profileOverview/badges";
import { Badge, RepeatTraderBadge } from "../../Badge";
import { Icon } from "../../Icon";
import { useSetPopup } from "../../popup/GlobalPopup";
import { PeachText } from "../../text/PeachText";

export function Badges({
  unlockedBadges,
  id,
}: {
  unlockedBadges: User["medals"];
  id: User["id"];
}) {
  const setPopup = useSetPopup();
  const openPeachBadgesPopup = () => setPopup(<MyBadgesPopup />);

  return (
    <TouchableOpacity
      style={tw`flex-row flex-wrap gap-1 max-w-46`}
      onPress={openPeachBadgesPopup}
    >
      {badges.map(([iconId, badgeName]) => (
        <Badge
          key={`profileOverviewIcon-${iconId}`}
          isUnlocked={unlockedBadges.includes(badgeName)}
          badgeName={badgeName}
        />
      ))}
      <RepeatTraderBadge id={id} />
    </TouchableOpacity>
  );
}

function MyBadgesPopup() {
  return (
    <InfoPopup
      title={i18n("peachBadges")}
      content={
        <>
          {badges.map(([icon, value], index) => (
            <Fragment key={`peachBadges.popup-${index}`}>
              <View style={tw`flex-row items-center mt-3`}>
                <View
                  style={tw`w-[18px] h-[18px] p-[3px] mx-[3px] rounded-full bg-info-light`}
                >
                  <Icon
                    id={icon}
                    color={tw.color("black-100")}
                    style={tw`w-3 h-3`}
                  />
                </View>
                <PeachText style={tw`ml-1 subtitle-1 text-black-100`}>
                  {i18n(`peachBadges.${value}`)}
                </PeachText>
              </View>
              <PeachText style={tw`text-black-100`}>
                {i18n(`peachBadges.${value}.description`)}
              </PeachText>
            </Fragment>
          ))}
        </>
      }
    />
  );
}
