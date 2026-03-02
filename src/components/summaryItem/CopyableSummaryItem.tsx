import { TouchableOpacity } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";
import { CopyAble } from "../ui/CopyAble";
import { SummaryItem, SummaryItemProps } from "./SummaryItem";

type Props = SummaryItemProps & {
  text: string;
};

export const CopyableSummaryItem = ({ text, ...props }: Props) => {
  const displayText =
    text.length <= 40
      ? text
      : text.slice(0, 5) + " ... " + text.slice(text.length - 5, text.length);

  return (
    <SummaryItem {...props}>
      <TouchableOpacity style={tw`flex-row items-center justify-between gap-2`}>
        <PeachText style={tw`subtitle-1`}>{displayText}</PeachText>
        <CopyAble value={text} />
      </TouchableOpacity>
    </SummaryItem>
  );
};
