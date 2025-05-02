import { TouchableOpacity, View } from "react-native";
import { PublicUser } from "../../../peach-api/src/@types/user";
import { Icon } from "../../components/Icon";
import { FixedHeightText } from "../../components/text/FixedHeightText";
import { PeachText } from "../../components/text/PeachText";
import { NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useUserStatus } from "../publicProfile/useUserStatus";
import { Rating } from "../settings/profile/profileOverview/Rating";
import { badges } from "../settings/profile/profileOverview/badges";

export function UserCard({
  user,
  isBuyer,
}: {
  user: PublicUser;
  isBuyer?: boolean;
}) {
  const navigation = useStackNavigation();
  const goToUserProfile = () => {
    navigation.navigate("publicProfile", { userId: user.id });
  };

  const { isDarkMode } = useThemeStore();

  return (
    <View
      style={tw`self-stretch border-2 rounded-2xl border-primary-main gap-10px py-10px px-sm`}
    >
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <TouchableOpacity
          onPress={goToUserProfile}
          style={tw`flex-row items-center px-3 py-1 border rounded-full gap-2px border-primary-main ${isDarkMode ? "bg-card" : "bg-primary-background-dark"} `}
        >
          <PeachText style={tw`subtitle-1`}>
            {isBuyer ? "buyer" : "seller"}
          </PeachText>
          <Icon id="user" size={24} color={tw.color("black-100")} />
          <Icon id="eye" size={14} color={tw.color("primary-main")} />
        </TouchableOpacity>
        <Rating
          rating={user.rating}
          isNewUser={user.trades < NEW_USER_TRADE_THRESHOLD}
          peachSize={20}
          textStyle={tw`-my-10 leading-loose h5`}
        />
      </View>
      <View style={tw`flex-row flex-wrap justify-end gap-1`}>
        {badges.map(([iconId, badgeName]) => {
          const isUnlocked = user.medals.includes(badgeName);
          const color = tw.color(
            isUnlocked ? "primary-main" : "primary-mild-1",
          );

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
        <BigBadge user={user} />
      </View>
    </View>
  );
}

const BADGE_SIZE = 16;
function BigBadge({ user }: { user: PublicUser }) {
  const { data } = useUserStatus(user.id);

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
