import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

/**
 * A simple hook to retrieve the state of the Keyboard
 * @returns wether the keyboard is open or not
 */
export const useKeyboard = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const sub1 = Keyboard.addListener("keyboardWillShow", () =>
      setKeyboardOpen(true),
    );
    const sub2 = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const sub3 = Keyboard.addListener("keyboardWillHide", () =>
      setKeyboardOpen(false),
    );
    const sub4 = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );

    return () => {
      sub1.remove();
      sub2.remove();
      sub3.remove();
      sub4.remove();
    };
  }, []);

  return keyboardOpen;
};
