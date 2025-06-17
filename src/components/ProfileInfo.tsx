import { View } from "react-native";
import { NEW_USER_TRADE_THRESHOLD } from "../constants";
import tw from "../styles/tailwind";
import { BigBadges } from "../views/explore/BigBadges";
import { UserBubble } from "../views/explore/UserBubble";
import { Rating } from "../views/settings/profile/profileOverview/Rating";

type Props = Pick<
  User,
  "openedTrades" | "canceledTrades" | "disputes" | "id" | "rating" | "medals"
>;

export const ProfileInfo = ({
  openedTrades,
  canceledTrades,
  disputes,
  id,
  rating,
  medals,
}: Props) => {
  const shouldHideRating =
    openedTrades < NEW_USER_TRADE_THRESHOLD &&
    canceledTrades === 0 &&
    disputes.lost === 0;
  return (
    <View style={tw`gap-1`}>
      <View style={tw`flex-row items-center justify-between`}>
        <UserBubble userId={id} hideIcons />
        <Rating
          rating={rating}
          shouldHideRating={shouldHideRating}
          peachSize={20}
          textStyle={tw`-my-10 leading-loose h5`}
        />
      </View>

      {!isNewUser && <BigBadges medals={medals} id={id} />}
    </View>
  );
};
