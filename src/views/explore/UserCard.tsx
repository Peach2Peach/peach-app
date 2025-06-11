import { View } from "react-native";
import { PublicUser } from "../../../peach-api/src/@types/user";
import { NEW_USER_TRADE_THRESHOLD } from "../../constants";
import tw from "../../styles/tailwind";
import { Rating } from "../settings/profile/profileOverview/Rating";
import { BigBadges } from "./BigBadges";
import { UserBubble } from "./UserBubble";

export function UserCard({
  user,
  isBuyer,
}: {
  user: PublicUser;
  isBuyer?: boolean;
}) {
  return (
    <View
      style={tw`self-stretch border-2 rounded-2xl border-primary-main gap-10px py-10px px-sm`}
    >
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <UserBubble userId={user.id} title={isBuyer ? "buyer" : "seller"} />
        <Rating
          rating={user.rating}
          isNewUser={user.trades < NEW_USER_TRADE_THRESHOLD}
          peachSize={20}
          textStyle={tw`-my-10 leading-loose h5`}
        />
      </View>
      <BigBadges {...user} />
    </View>
  );
}
