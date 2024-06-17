import { PeachText } from "../../../components/text/PeachText";
import { APPVERSION, BUILDNUMBER } from "../../../constants";
import tw from "../../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const VersionInfo = ({ style }: ComponentProps) => {
  const { t } = useTranslate("settings");

  return (
    <PeachText style={[tw`uppercase button-medium text-black-50`, style]}>
      {t("settings.peachApp")}
      {APPVERSION} ({BUILDNUMBER})
    </PeachText>
  );
};
