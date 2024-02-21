import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

type Props = {
  err: string;
};

export const RestoreBackupError = ({ err }: Props) => {
  const { t } = useTranslate("unassigned");
  const navigation = useStackNavigation();
  const goToContact = () => navigation.navigate("contact");

  return (
    <View style={tw`justify-between grow`}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <View>
          <PeachText style={tw`text-center h4 text-primary-background-light`}>
            {t("restoreBackup.title")}
          </PeachText>
          <PeachText
            style={tw`text-center body-l text-primary-background-light`}
          >
            {t(`${err}.text`, { ns: "error" })}
          </PeachText>
        </View>
        <Icon
          id="userX"
          size={128}
          color={tw.color("primary-background-light")}
        />
      </View>
      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw.color("primary-main")}
        onPress={goToContact}
      >
        {t("contactUs")}
      </Button>
    </View>
  );
};
