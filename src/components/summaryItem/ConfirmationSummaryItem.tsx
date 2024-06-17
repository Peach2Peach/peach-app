import tw from "../../styles/tailwind";
import { SummaryItemProps } from "./SummaryItem";
import { TextSummaryItem } from "./TextSummaryItem";
import { useTranslate } from "@tolgee/react";

type Props = Omit<SummaryItemProps, "title"> & {
  confirmed?: boolean;
};

export const ConfirmationSummaryItem = ({ confirmed, ...props }: Props) => {
  const { t } = useTranslate("contract");

  return (
    <TextSummaryItem
      {...props}
      title={t("status")}
      text={t(`wallet.transaction.${confirmed ? "confirmed" : "pending"}`, {
        ns: "wallet",
      })}
      iconId={confirmed ? "checkCircle" : "clock"}
      iconColor={confirmed ? tw.color("success-main") : tw.color("black-50")}
    />
  );
};
