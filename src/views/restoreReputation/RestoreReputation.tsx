import { useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useRoute } from "../../hooks/useRoute";
import { useUserUpdate } from "../../init/useUserUpdate";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { storeAccount } from "../../utils/account/storeAccount";
import { updateAccount } from "../../utils/account/updateAccount";
import i18n from "../../utils/i18n";
import { LOGIN_DELAY } from "./LOGIN_DELAY";

export const RestoreReputation = () => {
  const route = useRoute<"restoreReputation">();
  const [isRestored, setIsRestored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const account = useAccountStore((state) => state.account);
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  const userUpdate = useUserUpdate();

  const restoreReputation = async () => {
    setIsLoading(true);
    updateAccount(account, true);
    await userUpdate(route.params.referralCode);

    storeAccount(account);
    setIsRestored(true);

    setTimeout(() => {
      setIsLoggedIn(true);
    }, LOGIN_DELAY);
  };

  return (
    <Screen
      header={
        <Header
          title={i18n("restoreBackup.restoreReputation")}
          theme="transparent"
          hideGoBackButton={isLoading || isRestored}
        />
      }
      gradientBackground
    >
      {isRestored ? (
        <ReputationRestored />
      ) : isLoading ? (
        <RestoreReputationLoading />
      ) : (
        <View style={tw`justify-between grow`}>
          <View style={tw`items-center justify-center grow`}>
            <PeachText style={tw`subtitle-1 text-primary-background-light`}>
              {i18n("restoreBackup.dontWorry")}
            </PeachText>
          </View>

          <Button
            style={tw`self-center bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={restoreReputation}
          >
            {i18n("restoreBackup.restoreReputation")}
          </Button>
        </View>
      )}
    </Screen>
  );
};

function RestoreReputationLoading() {
  return (
    <View style={tw`items-center justify-center grow`}>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {i18n("restoreBackup.restoringReputation")}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {i18n("newUser.oneSec")}
      </PeachText>
      <Loading size="large" color={tw.color("primary-mild-1")} />
    </View>
  );
}

function ReputationRestored() {
  return (
    <View style={tw`items-center justify-center h-full`}>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {i18n("restoreBackup.reputationRestored")}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {i18n("restoreBackup.welcomeBack")}
      </PeachText>
      <Icon
        id="save"
        style={tw`w-32 h-32 mt-16`}
        color={tw.color("primary-background-light")}
      />
    </View>
  );
}
