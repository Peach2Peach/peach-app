import { atom, useAtomValue, useSetAtom } from "jotai";
import { OverlayComponent } from "./OverlayComponent";

const overlayAtom = atom<React.ReactNode>(undefined);
export const useSetGlobalOverlay = () => useSetAtom(overlayAtom);

export function GlobalOverlay() {
  const content = useAtomValue(overlayAtom);
  return <OverlayComponent>{content}</OverlayComponent>;
}
