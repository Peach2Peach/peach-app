import { View } from "react-native";
import { Screen } from "../../../components/Screen";
import { OptionButton } from "../../../components/buttons/OptionButton";
import {
  DISCORD,
  INSTAGRAM,
  NOSTR,
  TELEGRAM,
  TWITCH,
  TWITTER,
  YOUTUBE,
} from "../../../constants";
import tw from "../../../styles/tailwind";
import { openURL } from "../../../utils/web/openURL";
import { tolgee } from "../../../tolgee";

const socials = [
  { name: "twitter", url: TWITTER },
  { name: "instagram", url: INSTAGRAM },
  { name: "telegram", url: TELEGRAM },
  { name: "discord", url: DISCORD },
  { name: "twitch", url: TWITCH },
  { name: "youtube", url: YOUTUBE },
  { name: "nostr", url: NOSTR },
];

export const Socials = () => (
  <Screen header={tolgee.t("settings.socials.subtitle", { ns: "settings" })}>
    <View style={tw`items-center justify-center gap-2 grow`}>
      {socials.map(({ name, url }) => (
        <OptionButton key={name} onPress={() => openURL(url)}>
          {tolgee.t(name, { ns: "unassigned" })}
        </OptionButton>
      ))}
    </View>
  </Screen>
);
