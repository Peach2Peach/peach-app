import { atom, useAtom } from 'jotai'
import { Modal, View } from 'react-native'
import { PeachyBackground } from './components/PeachyBackground'
import tw from './styles/tailwind'

export const overlayAtom = atom<React.ReactNode>(undefined)
export function Overlay () {
  const [content] = useAtom(overlayAtom)
  return (
    <Modal visible={content !== undefined}>
      <PeachyBackground />
      <View style={[tw`flex-1 p-sm`, tw`md:p-md`]}>{content}</View>
    </Modal>
  )
}
