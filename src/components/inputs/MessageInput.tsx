import { ReactElement } from 'react'
import { NativeSyntheticEvent, Pressable, TextInput, TextInputEndEditingEventData, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type MessageInputProps = ComponentProps & {
  value?: string
  placeholder?: string
  disabled?: boolean
  disableSubmit?: boolean
  onChange?: Function
  onSubmit?: Function
  onFocus?: Function
  onBlur?: Function
}

export const MessageInput = ({
  value,
  placeholder,
  disabled = false,
  disableSubmit = false,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  testID,
}: MessageInputProps): ReactElement => {
  const onChangeText = (val: string) => (onChange ? onChange(val) : null)
  const onEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) =>
    onChange ? onChange(e.nativeEvent.text?.trim()) : null
  const onFocusHandler = () => (onFocus ? onFocus() : null)
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur()
  }
  const onSubmitHandler = () => (onSubmit && !disableSubmit ? onSubmit(value) : null)
  return (
    <View style={[tw`flex-row items-end px-2 rounded bg-info-background max-h-40`, disabled && tw`opacity-50`]}>
      <TextInput
        style={tw`flex-shrink w-full p-0 py-3 pl-1 leading-normal body-m text-black-1`}
        placeholderTextColor={tw`text-info-mild`.color}
        allowFontScaling={false}
        removeClippedSubviews={false}
        returnKeyType={'send'}
        editable={!disabled}
        multiline={true}
        textAlignVertical={'center'}
        blurOnSubmit={false}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        autoCapitalize="sentences"
        {...{ testID, placeholder, value, onChangeText, onEndEditing }}
      />
      <Pressable style={tw`px-2 py-3`} onPress={onSubmitHandler}>
        <Icon id="arrowRightCircle" style={tw`w-6 h-6`} color={tw`text-info-light`.color} />
      </Pressable>
    </View>
  )
}
