import { FeeInfo } from "./FeeInfo";
import { useTranslate } from "@tolgee/react";

type Props = {
  fee: number;
};

const { t } = useTranslate("wallet");

export const CurrentFee = ({ fee }: Props) => (
  <FeeInfo label={t("wallet.bumpNetworkFees.currentFee")} fee={fee} />
);
