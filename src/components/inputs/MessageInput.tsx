import React, { ReactElement } from 'react'
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

/**
 * @description Component to display an input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.placeholder] text indicating action
 * @param [props.disabled] if true, disable input field
 * @param [props.disableSubmit] if true, disable submit field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.onFocus] onFocus handler from outside
 * @param [props.onBlur] onBlur handler from outside
 * @example
 * <MessageInput
 *   onChange={setNewMessage}
 *   onSubmit={sendMessage} disableSubmit={disableSend}
 *   value={newMessage}
 *   placeholder={i18n('chat.yourMessage')}
    />
 */

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
  // TODO Attach files
  return (
    <View style={[tw`flex-row items-end px-2 rounded bg-info-background max-h-40`, disabled ? tw`opacity-50` : {}]}>
      <TextInput
        testID={testID}
        style={tw`flex-shrink w-full p-0 py-3 pl-1 leading-normal body-m text-black-1`}
        placeholder={placeholder}
        placeholderTextColor={tw`text-info-mild`.color}
        allowFontScaling={false}
        removeClippedSubviews={false}
        returnKeyType={'send'}
        value={value}
        editable={!disabled}
        multiline={true}
        textAlignVertical={'center'}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        blurOnSubmit={false}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        autoCapitalize="sentences"
      />
      <Pressable style={tw`px-2 py-3`} onPress={() => (onSubmit && !disableSubmit ? onSubmit(value) : null)}>
        <Icon id="arrowRightCircle" style={tw`w-6 h-6`} color={tw`text-info-light`.color} />
      </Pressable>
    </View>
  )
}

export default MessageInput
