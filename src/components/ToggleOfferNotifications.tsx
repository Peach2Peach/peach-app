import { useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import {
  user69DetailsKeys,
  useUser69Details,
} from "../hooks/query/peach069/useUser69";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { peachAPI } from "../utils/peachAPI";
import { Toggle } from "./inputs/Toggle";
import { PeachText } from "./text/PeachText";

export const ToggleOfferNotifications = () => {
  const { user: user69 } = useUser69Details();
  const queryClient = useQueryClient();
  if (!user69) return <></>;
  return (
    <View>
      <Toggle
        textOnRight
        red={false}
        enabled={user69.offerAlertsActive}
        onPress={async () => {
          await peachAPI.private.peach069.setFilterOfferAlertsOnSelfUser69({
            active: !user69.offerAlertsActive,
          });
          await queryClient.invalidateQueries({
            queryKey: user69DetailsKeys.details(),
          });
        }}
        textStyle={tw`text-black-25`}
      >
        {i18n("settings.filterAlerts")}
      </Toggle>
      <PeachText
        style={[
          tw`text-black-65`,
          {
            fontSize: 14,
            fontWeight: "600",
            lineHeight: 20,
            letterSpacing: 0.12,
          },
        ]}
      >
        {i18n("settings.filterAlerts.description")}
      </PeachText>
    </View>
  );
};
