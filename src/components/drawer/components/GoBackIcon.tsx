import { TouchableOpacity } from "react-native";
import { useShallow } from "zustand/shallow";
import tw from "../../../styles/tailwind";
import { Icon } from "../../Icon";
import { useDrawerState } from "../useDrawerState";

export const GoBackIcon = () => {
  const [previousDrawer, updateDrawer] = useDrawerState(
    useShallow((state) => [state.previousDrawer, state.updateDrawer]),
  );
  const goBack = () => {
    if (previousDrawer) {
      updateDrawer(previousDrawer);
    }
  };

  return (
    <TouchableOpacity
      onPress={goBack}
      disabled={!previousDrawer}
      style={!previousDrawer && tw`opacity-0`}
    >
      <Icon id="chevronLeft" size={24} color={tw.color("black-25")} />
    </TouchableOpacity>
  );
};
