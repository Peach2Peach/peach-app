import { useTranslate } from "@tolgee/react";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useLanguage } from "../../hooks/useLanguage";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { sortAlphabetically } from "../../utils/array/sortAlphabetically";
import i18n from "../../utils/i18n";

export const Language = () => {
  const { locale, updateLocale } = useLanguage();
  const navigation = useStackNavigation();
  const { t } = useTranslate("global");

  const onConfirm = () => {
    navigation.goBack();
  };

  return (
    <Screen header={t("language")}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <RadioButtons
          selectedValue={locale}
          items={i18n
            .getLocales()
            // @ts-ignore
            .map((l) => ({ value: l, display: t(`languageName.${l}`) }))
            .sort((a, b) => sortAlphabetically(a.display, b.display))}
          onButtonPress={updateLocale}
        />
      </PeachScrollView>
      <Button style={tw`self-center`} onPress={onConfirm}>
        {t("confirm")}
      </Button>
    </Screen>
  );
};
