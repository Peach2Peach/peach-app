import { Fragment } from "react";
import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { FixedHeightText } from "../../components/text/FixedHeightText";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useUserStatus } from "../publicProfile/useUserStatus";
import { badges } from "../settings/profile/profileOverview/badges";

const BADGE_SIZE = 16;
function BigBadge({ userId }: { userId: string }) {
  const { data } = useUserStatus(userId);

  if (!data) return null;

  const { badExperience, trades } = data;
  const color = tw.color(!badExperience ? "primary-main" : "error-main");
  return (
    <View
      style={[
        tw`flex-row items-center px-2 border rounded-full gap-2px`,
        { borderColor: color },
      ]}
    >
      <PeachText style={[tw`subtitle-1`, { color }]}>
        {i18n(`peachBadges.repeatTrader`)}
      </PeachText>
      {!badExperience ? (
        <View
          style={[
            tw`items-center justify-center border rounded-full px-2px border-primary-main`,
            {
              height: BADGE_SIZE,
              minWidth: BADGE_SIZE,
            },
          ]}
        >
          <FixedHeightText
            height={8}
            style={tw`pt-px text-center subtitle-1 text-13px text-primary-main`}
          >
            {trades}
          </FixedHeightText>
        </View>
      ) : (
        <Icon
          id={"thumbsDown"}
          color={tw.color("error-main")}
          size={BADGE_SIZE}
        />
      )}
    </View>
  );
}

export function BigBadges({
  medals,
  id,
  hideDisabled = false,
}: {
  medals: Medal[];
  id: string;
  hideDisabled?: boolean;
}) {
  return (
    <View style={tw`flex-row flex-wrap justify-end gap-1`}>
      {badges.map(([iconId, badgeName]) => {
        const isUnlocked = medals.includes(badgeName);
        if (hideDisabled && !isUnlocked) return <Fragment key={badgeName} />;
        const color = tw.color(isUnlocked ? "primary-main" : "primary-mild-1");
        return (
          <View
            style={[
              tw`flex-row items-center px-2 border rounded-full gap-2px`,
              { borderColor: color },
            ]}
            key={badgeName}
          >
            <PeachText style={[tw`subtitle-1`, { color }]}>
              {i18n(`peachBadges.${badgeName}`)}
            </PeachText>
            <Icon id={iconId} color={color} size={16} />
          </View>
        );
      })}
      <BigBadge userId={id} />
    </View>
  );
}
