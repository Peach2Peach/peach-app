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

  if (!data?.trades) return null;

  const hadBadExperience = data?.badExperience;
  const color = tw.color(!hadBadExperience ? "primary-main" : "error-main");
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
      {!hadBadExperience ? (
        <View
          style={[
            tw`items-center justify-center border rounded-full px-2px`,
            {
              borderColor: tw.color(
                hadBadExperience ? "error-main" : "primary-main",
              ),
              height: BADGE_SIZE,
              minWidth: BADGE_SIZE,
            },
          ]}
        >
          <FixedHeightText
            height={8}
            style={[
              tw`pt-px text-center subtitle-1 text-13px`,
              {
                color: tw.color(
                  hadBadExperience ? "error-main" : "primary-main",
                ),
              },
            ]}
          >
            {data.trades}
          </FixedHeightText>
        </View>
      ) : (
        <Icon
          id={"thumbsDown"}
          color={tw.color(hadBadExperience ? "error-main" : "primary-main")}
          size={BADGE_SIZE}
        />
      )}
    </View>
  );
}

export function BigBadges({ medals, id }: { medals: Medal[]; id: string }) {
  return (
    <View style={tw`flex-row flex-wrap justify-end gap-1`}>
      {badges.map(([iconId, badgeName]) => {
        const isUnlocked = medals.includes(badgeName);
        if (!isUnlocked) return <Fragment key={badgeName} />;
        const color = tw.color("primary-main");
        return (
          <View
            style={[
              tw`flex-row items-center px-2 border rounded-full gap-2px`,
              {
                borderColor: color,
              },
            ]}
            key={badgeName}
          >
            <PeachText
              style={[
                tw`subtitle-1`,
                {
                  color,
                },
              ]}
            >
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
