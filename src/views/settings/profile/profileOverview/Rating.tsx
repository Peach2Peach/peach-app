import { View } from "react-native";
import RatingPeach from "../../../../assets/icons/ratingPeach.svg";
import { PeachText } from "../../../../components/text/PeachText";
import { CENT } from "../../../../constants";
import tw from "../../../../styles/tailwind";
import { interpolate } from "../../../../utils/math/interpolate";
import { useTranslate } from "@tolgee/react";

type RatingProps = {
  rating: number;
  isNewUser?: boolean;
};

export const MAX_NUMBER_OF_PEACHES = 5;
export const CLIENT_RATING_RANGE = [0, MAX_NUMBER_OF_PEACHES] satisfies [
  number,
  number,
];
export const SERVER_RATING_RANGE = [-1, 1] satisfies [number, number];

export const Rating = ({ rating, isNewUser }: RatingProps) => {
  const { t } = useTranslate();

  if (isNewUser) {
    return (
      <PeachText style={tw`subtitle-2 text-black-65`}>{t("newUser")}</PeachText>
    );
  }
  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`flex-row gap-1`}>
        {[...Array(MAX_NUMBER_OF_PEACHES)].map((_value, index) => (
          <RatingPeach
            key={`rating-peach-background-${index}`}
            style={tw`w-3 h-3 opacity-50`}
          />
        ))}
        <View
          style={[
            tw`absolute flex-row self-center gap-1 overflow-hidden`,
            {
              width: `${interpolate(rating, SERVER_RATING_RANGE, [0, CENT])}%`,
            },
          ]}
        >
          {[...Array(MAX_NUMBER_OF_PEACHES)].map((_value, peach) => (
            <RatingPeach
              key={`rating-peach-colored-${peach}`}
              style={tw`w-3 h-3`}
            />
          ))}
        </View>
      </View>

      <PeachText style={tw`text-black-65 button-small`}>
        {interpolate(rating, SERVER_RATING_RANGE, CLIENT_RATING_RANGE).toFixed(
          1,
        )}
      </PeachText>
    </View>
  );
};
