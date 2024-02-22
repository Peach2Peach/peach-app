import { FeeInfo } from "./FeeInfo";
import { useTranslate } from "@tolgee/react";

type Props = {
  fee: number;
};

export const CurrentFee = ({ fee }: Props) => {
  const { t } = useTranslate("wallet");
  return (
    <FeeInfo
      label={t("wallet.bumpNetworkFees.currentFee", { ns: "wallet" })}
      fee={fee}
    />
  );
};
