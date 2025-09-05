import i18n from "../utils/i18n";
import { InfoPopup } from "./InfoPopup";

type Props = {
  id: string;
  showTitle?: boolean;
  dontShowHelpButton?: boolean;
};

export function HelpPopup({
  id,
  showTitle = true,
  dontShowHelpButton = false,
}: Props) {
  return (
    <InfoPopup
      title={showTitle ? i18n(`help.${id}.title`) : undefined}
      content={i18n(`help.${id}.description`)}
      dontShowHelpButton={dontShowHelpButton}
    />
  );
}
