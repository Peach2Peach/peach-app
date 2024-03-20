import { Screen } from "../../../components/Screen";
import { BulletPoint } from "../../../components/text/BulletPoint";
import { PeachText } from "../../../components/text/PeachText";
import { CENT } from "../../../constants";
import { useConfigStore } from "../../../store/configStore/configStore";
import tw from "../../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const PeachFees = () => {
  const peachFee = useConfigStore((state) => state.peachFee);
  const { t } = useTranslate("settings");

  return (
    <Screen style={tw`justify-center`} header={t("settings.peachFees")}>
      <PeachText>
        {t("settings.fees.text.1")}
        <PeachText style={tw`text-primary-main`}>
          {" "}
          {(peachFee * CENT).toString()}%{" "}
        </PeachText>
        {t("settings.fees.text.2")}
        {"\n"}
      </PeachText>
      <PeachText>
        {t("settings.fees.text.3")}
        {"\n"}
      </PeachText>
      <BulletPoint text={t("settings.fees.point.1")} />
      <BulletPoint text={t("settings.fees.point.2")} />
      <BulletPoint text={t("settings.fees.point.3")} />
    </Screen>
  );
};
