import tw from "../../../styles/tailwind";
import { PeachText } from "../../text/PeachText";
import { useTranslate } from "@tolgee/react";

type Props = {
  premium: number;
};

export const PremiumText = ({ premium }: Props) => {
  const { t } = useTranslate("unassigned");

  return (
    <PeachText style={tw`text-black-65`}>
      {" "}
      {premium === 0
        ? t("match.atMarketPrice")
        : t(premium > 0 ? "match.premium" : "match.discount", {
            premium: String(Math.abs(premium)),
          })}
    </PeachText>
  );
};
