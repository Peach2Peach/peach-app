import { Modal, Pressable, View } from 'react-native'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'

export const Popup = () => {
  const { visible, closePopup, popupComponent } = usePopupStore()

  return (
    <Modal transparent visible={visible} onRequestClose={closePopup}>
      <View style={tw`justify-center flex-1`}>
        <Pressable style={tw`absolute w-full h-full bg-black-100 opacity-40`} onPress={closePopup} />
        {popupComponent}
      </View>
    </Modal>
  )
}
