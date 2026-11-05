import { atom, useAtomValue, useSetAtom } from "jotai";
import { OverlayComponent } from "./OverlayComponent";
import { useIsPinOverlayBlocking } from "./hooks/useIsPinOverlayBlocking";

const overlayAtom = atom<React.ReactNode>(undefined);
export const useSetGlobalOverlay = () => useSetAtom(overlayAtom);

export function GlobalOverlay() {
  const content = useAtomValue(overlayAtom);
  const isPinOverlayBlocking = useIsPinOverlayBlocking();
  return (
    <OverlayComponent visible={!isPinOverlayBlocking}>{content}</OverlayComponent>
  );
}
