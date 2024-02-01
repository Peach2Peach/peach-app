import { TouchableOpacity } from "react-native";
import { shallow } from "zustand/shallow";
import tw from "../../../styles/tailwind";
import { Icon } from "../../Icon";
import { useDrawerState } from "../useDrawerState";

export const GoBackIcon = () => {
  const [previousDrawer, updateDrawer] = useDrawerState(
    (state) => [state.previousDrawer, state.updateDrawer],
    shallow,
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
