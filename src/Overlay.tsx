import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Modal, View } from 'react-native'
import { PeachyBackground } from './components/PeachyBackground'
import tw from './styles/tailwind'

const overlayAtom = atom<React.ReactNode>(undefined)
export const useSetOverlay = () => useSetAtom(overlayAtom)

export function Overlay () {
  const content = useAtomValue(overlayAtom)
  return (
    <Modal visible={content !== undefined}>
      <PeachyBackground />
      <View style={[tw`flex-1 p-sm`, tw`md:p-md`]}>{content}</View>
    </Modal>
  )
}
