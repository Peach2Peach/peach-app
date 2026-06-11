import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePgpMigrationStore } from "../../store/usePgpMigrationStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Loading } from "../Loading";
import { Button } from "../buttons/Button";
import { PeachText } from "../text/PeachText";

/**
 * @description Full-screen blocking overlay shown during the one-time PGP key
 * migration ("migrating") and afterwards as a success screen with a "Proceed"
 * button ("success"). Rendered on top of the navigator; reads its state from
 * usePgpMigrationStore.
 */
export const PgpKeyMigrationScreen = () => {
  const status = usePgpMigrationStore((state) => state.status);
  const setStatus = usePgpMigrationStore((state) => state.setStatus);
  const { isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();

  if (status === "idle") return null;

  const background = isDarkMode
    ? tw`bg-backgroundMain-dark`
    : tw`bg-backgroundMain-light`;

  return (
    <View
      style={[
        tw`absolute inset-0 z-50 items-center px-8`,
        background,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {status === "migrating" ? (
        <View style={tw`items-center justify-center flex-1 gap-6`}>
          <Loading size="large" />
          <PeachText style={tw`text-center h6`}>
            {i18n("pgpMigration.inProgress.title")}
          </PeachText>
          <PeachText style={tw`text-center body-m`}>
            {i18n("pgpMigration.inProgress.description")}
          </PeachText>
        </View>
      ) : (
        <View style={tw`flex-1 w-full`}>
          <View style={tw`items-center justify-center flex-1 gap-6`}>
            <PeachText style={tw`text-center h6`}>
              {i18n("pgpMigration.success.title")}
            </PeachText>
            <PeachText style={tw`text-center body-m`}>
              {i18n("pgpMigration.success.description")}
            </PeachText>
          </View>
          <Button style={tw`self-center`} onPress={() => setStatus("idle")}>
            {i18n("pgpMigration.proceed")}
          </Button>
        </View>
      )}
    </View>
  );
};
