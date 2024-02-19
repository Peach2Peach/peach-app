import { InfoPopup } from "./InfoPopup";
import { useTranslate } from "@tolgee/react";

type Props = {
  id: string;
  showTitle?: boolean;
};

export function HelpPopup({ id, showTitle = true }: Props) {
  const { t } = useTranslate("help");
  return (
    <InfoPopup
      title={showTitle ? t(`help.${id}.title`) : undefined}
      content={t(`help.${id}.description`)}
    />
  );
}
