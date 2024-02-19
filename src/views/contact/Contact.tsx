import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { OptionButton } from "../../components/buttons/OptionButton";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { LinedText } from "../../components/ui/LinedText";
import { DISCORD, TELEGRAM } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { openURL } from "../../utils/web/openURL";
import { useTranslate } from "@tolgee/react";

export const contactReasonsNoAccount: ContactReason[] = [
  "bug",
  "accountLost",
  "question",
  "sellMore",
  "other",
];
export const contactReasonsWithAccount: ContactReason[] = [
  "bug",
  "userProblem",
  "sellMore",
  "other",
];
const openTelegram = () => openURL(TELEGRAM);
const openDiscord = () => openURL(DISCORD);

export const Contact = () => {
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const showHelp = () =>
    setPopup(<HelpPopup id="contactEncryption" showTitle={false} />);
  const { t } = useTranslate("unassigned");

  const goToReport = (reason: ContactReason) => {
    navigation.navigate("report", {
      reason,
      shareDeviceID: reason === "accountLost",
      topic: t({
        key: `contact.reason.${reason}`,
        ns: "contact",
      }),
    });
  };
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const contactReasons = publicKey
    ? contactReasonsWithAccount
    : contactReasonsNoAccount;

  return (
    <Screen
      header={
        <Header
          title={t({ key: "contact.title", ns: "contact" })}
          icons={[{ ...headerIcons.help, onPress: showHelp }]}
        />
      }
    >
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-12`}
      >
        <View style={tw`w-full gap-4`}>
          <LinedText>
            <PeachText style={tw`text-black-65`}>
              {t("report.mailUs")}
            </PeachText>
          </LinedText>
          <>
            {contactReasons.map((reason) => (
              <ContactButton
                reason={reason}
                goToReport={goToReport}
                key={`contact-button-${reason}`}
              />
            ))}
          </>
        </View>
        <View style={tw`w-full gap-4`}>
          <LinedText>
            <PeachText style={tw`text-black-65`}>
              {t("report.communityHelp")}
            </PeachText>
          </LinedText>
          <OptionButton onPress={openTelegram}>{t("telegram")}</OptionButton>
          <OptionButton onPress={openDiscord}>{t("discord")}</OptionButton>
        </View>
      </PeachScrollView>
    </Screen>
  );
};

type Props = {
  reason: ContactReason;
  goToReport: (name: ContactReason) => void;
};

function ContactButton({ reason, goToReport }: Props) {
  const { t } = useTranslate("contact");
  return (
    <OptionButton onPress={() => goToReport(reason)}>
      {t(`contact.reason.${reason}`)}
    </OptionButton>
  );
}
