import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { View } from "react-native";
import { Header } from "../../../components/Header";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { ProfileInfo } from "../../../components/ProfileInfo";
import { Screen } from "../../../components/Screen";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { ClosePopupAction } from "../../../components/popup/actions/ClosePopupAction";
import { TouchableRedText } from "../../../components/text/TouchableRedText";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import { ErrorPopup } from "../../../popups/ErrorPopup";
import { HelpPopup } from "../../../popups/HelpPopup";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import tw from "../../../styles/tailwind";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import i18n from "../../../utils/i18n";
import { headerIcons } from "../../../utils/layout/headerIcons";
import { peachAPI } from "../../../utils/peachAPI";
import { AccountInfo } from "./AccountInfo";
import { TradingLimits } from "./TradingLimits";

export const MyProfile = () => {
  const { user, isLoading } = useSelfUser();
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="tradingLimit" />);
  if (isLoading || !user) return <></>;

  return (
    <Screen
      header={
        <Header
          title={i18n("settings.myProfile")}
          icons={[{ ...headerIcons.help, onPress: showHelp }]}
        />
      }
    >
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-between grow gap-7`}
      >
        <View style={tw`gap-12`}>
          <View style={tw`gap-6`}>
            <ProfileInfo user={user} />
            <TradingLimits />
          </View>
          <AccountInfo user={user} />
        </View>
        <DeleteAccountButton style={tw`self-center`} />
      </PeachScrollView>
    </Screen>
  );
};

function DeleteAccountButton({ style }: ComponentProps) {
  const setPopup = useSetPopup();
  const { mutate: logoutUser } = useLogoutUser();

  const showPopup = useCallback(
    (popupChain = ["popup", "forRealsies", "success"]) => {
      const title = popupChain[0];
      const isSuccess = popupChain.length === 1;
      if (isSuccess) {
        deleteAccount();
        logoutUser();
      }

      const onPress = () => showPopup(popupChain.slice(1));

      setPopup(
        <ErrorPopup
          title={i18n(
            `settings.deleteAccount.${isSuccess ? "success" : "popup"}.title`,
          )}
          content={i18n(`settings.deleteAccount.${title}`)}
          actions={
            <>
              {!isSuccess && (
                <PopupAction
                  label={i18n("settings.deleteAccount")}
                  iconId="trash"
                  onPress={onPress}
                />
              )}
              <ClosePopupAction
                reverseOrder
                style={isSuccess && tw`justify-center`}
              />
            </>
          }
        />,
      );
    },
    [logoutUser, setPopup],
  );

  return (
    <TouchableRedText onPress={() => showPopup()} style={style} iconId="trash">
      {i18n("settings.deleteAccount")}
    </TouchableRedText>
  );
}

function useLogoutUser() {
  const setIsLoggedIn = useSettingsStore((state) => state.setIsLoggedIn);
  return useMutation({
    mutationFn: () => peachAPI.private.user.logoutUser(),
    onSuccess: () => setIsLoggedIn(false),
  });
}
