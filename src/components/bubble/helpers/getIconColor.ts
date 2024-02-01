import tw from "../../../styles/tailwind";
import { BubbleProps } from "../Bubble";
import { getTextColor } from "./getTextColor";

export const getIconColor = ({
  color,
  ghost,
}: Pick<BubbleProps, "color" | "ghost">) => {
  if (color === "primary-mild")
    return ghost ? tw`text-black-100` : tw`text-primary-main`;
  return getTextColor({ color, ghost });
};
