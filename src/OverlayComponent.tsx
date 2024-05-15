import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PeachyBackground } from "./components/PeachyBackground";
import tw from "./styles/tailwind";

export function OverlayComponent({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={children !== undefined}>
      <PeachyBackground />
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <View style={[tw`flex-1 p-sm`, tw`md:p-md`]}>{children}</View>
      </View>
    </Modal>
  );
}
