import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PeachScrollView, PrimaryButton, Text } from '../../../components'
import { PopupState, usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'

export const TestViewPopups = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const openPopup = (level: Level, options: Partial<PopupState> = {}) =>
    setPopup({
      title: 'There once was a trader named Pete',
      content: (
        <View>
          <Text>
            Who traded bitcoin on peach{'\n'}
            He found it quite neat{'\n'}
            To trade on the street{'\n'}
            And never again would he lose a seat
          </Text>
        </View>
      ),
      visible: true,
      level,
      action1: {
        callback: closePopup,
        label: 'close',
        icon: 'checkSquare',
      },
      action2: {
        callback: closePopup,
        label: 'also close',
        icon: 'xSquare',
      },
      ...options,
    })
  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <PrimaryButton onPress={() => openPopup('APP')}>APP Popup</PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('APP', { action1: undefined, action2: undefined })}>
        APP Popup without defined actions
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('APP', { requireUserAction: true })}>
        User action required
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('DEFAULT')}>
        Default Popup
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('WARN')}>
        Warn Popup
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('ERROR')}>
        Error Popup
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('SUCCESS')}>
        Success Popup
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openPopup('INFO')}>
        Info Popup
      </PrimaryButton>
    </PeachScrollView>
  )
}
