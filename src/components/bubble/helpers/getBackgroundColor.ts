import tw from "../../../styles/tailwind";
import { BubbleProps } from "../Bubble";

export const getBackgroundColor = ({
  color,
  ghost,
}: Pick<BubbleProps, "color" | "ghost">) => {
  if (color === "primary")
    return ghost ? tw`bg-primary-background-light` : tw`bg-primary-main`;
  if (color === "primary-mild")
    return ghost
      ? tw`bg-primary-background-light`
      : tw`bg-primary-background-dark`;

  return tw`bg-transparent`;
};
