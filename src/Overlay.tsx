import { atom, useAtomValue, useSetAtom } from "jotai";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PeachyBackground } from "./components/PeachyBackground";
import { GlobalPopup } from "./components/popup/GlobalPopup";
import tw from "./styles/tailwind";

const overlayAtom = atom<React.ReactNode>(undefined);
export const useSetOverlay = () => useSetAtom(overlayAtom);

export function Overlay() {
  const content = useAtomValue(overlayAtom);
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={content !== undefined}>
      <GlobalPopup />
      <PeachyBackground />
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <View style={[tw`flex-1 p-sm`, tw`md:p-md`]}>{content}</View>
      </View>
    </Modal>
  );
}
