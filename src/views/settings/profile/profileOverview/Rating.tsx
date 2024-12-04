import { StyleProp, TextStyle, View } from "react-native";
import RatingPeach from "../../../../assets/icons/ratingPeach.svg";
import { PeachText } from "../../../../components/text/PeachText";
import { CENT } from "../../../../constants";
import { useThemeStore } from "../../../../store/theme";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { interpolate } from "../../../../utils/math/interpolate";

type RatingProps = {
  rating: number;
  isNewUser?: boolean;
  peachSize?: number;
  textStyle?: StyleProp<TextStyle>;
};

const DEFAULT_PEACH_SIZE = 12;
const MAX_NUMBER_OF_PEACHES = 5;
export const CLIENT_RATING_RANGE = [0, MAX_NUMBER_OF_PEACHES] satisfies [
  number,
  number,
];
export const SERVER_RATING_RANGE = [-1, 1] satisfies [number, number];

export const Rating = ({
  rating,
  isNewUser,
  peachSize = DEFAULT_PEACH_SIZE,
  textStyle,
}: RatingProps) => {
  const { isDarkMode } = useThemeStore();

  return isNewUser ? (
    <PeachText
      style={[
        tw.style(
          "subtitle-2",
          isDarkMode ? "text-backgroundLight-light" : "text-black-65",
        ),
        textStyle,
      ]}
    >
      {i18n("newUser")}
    </PeachText>
  ) : (
    <View style={tw`flex-row items-center`}>
      <View style={tw`flex-row gap-1`}>
        {[...Array(MAX_NUMBER_OF_PEACHES)].map((_value, index) => (
          <RatingPeach
            key={`rating-peach-background-${index}`}
            style={[tw`opacity-50`, { width: peachSize, height: peachSize }]}
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
              style={{ width: peachSize, height: peachSize }}
            />
          ))}
        </View>
      </View>

      <PeachText
        style={[
          tw.style(
            "button-small",
            isDarkMode ? "text-primary-mild-1" : "text-black-65",
          ),
          textStyle,
        ]}
      >
        {interpolate(rating, SERVER_RATING_RANGE, CLIENT_RATING_RANGE).toFixed(
          1,
        )}
      </PeachText>
    </View>
  );
};
