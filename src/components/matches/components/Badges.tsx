import { Fragment } from "react";
import { View } from "react-native";
import tw from "../../../styles/tailwind";
import { badges } from "../../../views/settings/profile/profileOverview/badges";
import { Badge, RepeatTraderBadge } from "../../Badge";

type Props = {
  unlockedBadges: User["medals"];
  id: User["id"];
};

export function Badges({ unlockedBadges, id }: Props) {
  return (
    <View style={tw`flex-row flex-wrap gap-1 max-w-46`}>
      {badges.map(([iconId, badgeName]) => {
        if (!unlockedBadges.includes(badgeName)) {
          return <Fragment key={`profileOverviewIcon-${iconId}`} />;
        }
        return (
          <Badge
            key={`profileOverviewIcon-${iconId}`}
            isUnlocked={unlockedBadges.includes(badgeName)}
            badgeName={badgeName}
          />
        );
      })}
      <RepeatTraderBadge id={id} />
    </View>
  );
}
