import tw from "../../../styles/tailwind";
import { PeachText } from "../../text/PeachText";
import { useDrawerState } from "../useDrawerState";

export const DrawerTitle = () => {
  const title = useDrawerState((state) => state.title);
  return <PeachText style={tw`text-center drawer-title`}>{title}</PeachText>;
};
