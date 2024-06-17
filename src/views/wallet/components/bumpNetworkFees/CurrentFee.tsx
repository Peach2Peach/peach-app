import { useTranslate } from "@tolgee/react";
import { FeeInfo } from "./FeeInfo";

type Props = {
  fee: number;
};

export const CurrentFee = ({ fee }: Props) => {
  const { t } = useTranslate("wallet");
  return <FeeInfo label={t("wallet.bumpNetworkFees.currentFee")} fee={fee} />;
};
