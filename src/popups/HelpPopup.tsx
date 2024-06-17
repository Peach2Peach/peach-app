import { useTranslate } from "@tolgee/react";
import { InfoPopup } from "./InfoPopup";

type Props = {
  id: string;
  showTitle?: boolean;
};

export function HelpPopup({ id, showTitle = true }: Props) {
  const { t } = useTranslate("help");
  return (
    <InfoPopup
      // @ts-ignore
      title={showTitle ? t(`help.${id}.title`) : undefined}
      // @ts-ignore
      content={t(`help.${id}.description`)}
    />
  );
}
