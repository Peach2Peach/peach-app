import { View } from "react-native";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import tw from "../../styles/tailwind";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { CopyAble } from "../ui/CopyAble";
import { SummaryItem, SummaryItemProps } from "./SummaryItem";
import { useTranslate } from "@tolgee/react";

type Props = Omit<SummaryItemProps, "title"> & {
  amount: number;
};

export const AmountSummaryItem = ({ amount, ...props }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const { t } = useTranslate("global");
  return (
    <SummaryItem {...props} title={t("amount")}>
      <View style={tw`flex-row items-center gap-2`}>
        <BTCAmount amount={amount} size={isMediumScreen ? "medium" : "small"} />
        <CopyAble value={String(amount)} />
      </View>
    </SummaryItem>
  );
};
