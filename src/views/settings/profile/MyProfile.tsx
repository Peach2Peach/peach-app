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
import tw from "../../../styles/tailwind";
import { useAccountStore } from "../../../utils/account/account";
import { deleteAccount } from "../../../utils/account/deleteAccount";
import { headerIcons } from "../../../utils/layout/headerIcons";
import { peachAPI } from "../../../utils/peachAPI";
import { AccountInfo } from "./AccountInfo";
import { TradingLimits } from "./TradingLimits";
import { useTranslate } from "@tolgee/react";

export const MyProfile = () => {
  const { t } = useTranslate("settings");
  const { user, isLoading } = useSelfUser();
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="tradingLimit" />);
  if (isLoading || !user) return <></>;

  return (
    <Screen
      header={
        <Header
          title={t("settings.myProfile")}
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
  const { t } = useTranslate("settings");
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
          title={t(
            `settings.deleteAccount.${isSuccess ? "success" : "popup"}.title`,
          )}
          content={t(`settings.deleteAccount.${title}`)}
          actions={
            <>
              {!isSuccess && (
                <PopupAction
                  label={t("settings.deleteAccount")}
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
    [logoutUser, setPopup, t],
  );

  return (
    <TouchableRedText onPress={() => showPopup()} style={style} iconId="trash">
      {t("settings.deleteAccount")}
    </TouchableRedText>
  );
}

function useLogoutUser() {
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn);
  return useMutation({
    mutationFn: () => peachAPI.private.user.logoutUser(),
    onSuccess: () => setIsLoggedIn(false),
  });
}
