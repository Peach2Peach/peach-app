import { PeachText } from "../../../components/text/PeachText";
import { APPVERSION, BUILDNUMBER } from "../../../constants";
import tw from "../../../styles/tailwind";
import { tolgee } from "../../../tolgee";

export const VersionInfo = ({ style }: ComponentProps) => (
  <PeachText style={[tw`uppercase button-medium text-black-50`, style]}>
    {tolgee.t("settings.peachApp", { ns: "settings" })}
    {APPVERSION} ({BUILDNUMBER})
  </PeachText>
);
