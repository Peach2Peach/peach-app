import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Modal, Pressable, View } from "react-native";
import tw from "../../styles/tailwind";

const popupAtom = atom<React.ReactNode | null>(null);
export const useSetPopup = () => useSetAtom(popupAtom);
export const useClosePopup = () => {
  const setPopup = useSetPopup();
  const closePopup = useCallback(() => setPopup(null), [setPopup]);
  return closePopup;
};

export const GlobalPopup = () => {
  const popupComponent = useAtomValue(popupAtom);
  const closePopup = useClosePopup();
  return (
    <Modal
      transparent
      visible={popupComponent !== null}
      onRequestClose={closePopup}
    >
      <View style={tw`justify-center flex-1`}>
        <Pressable
          style={tw`absolute w-full h-full bg-black-100 opacity-40`}
          onPress={closePopup}
        />
        {popupComponent}
      </View>
    </Modal>
  );
};
