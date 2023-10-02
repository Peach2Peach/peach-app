import { NativeSyntheticEvent, Pressable, TextInput, TextInputEndEditingEventData, View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'

type Props = {
  onChangeText: (val: string) => void
  onSubmit: (val: string | undefined) => void
  disabled: boolean
  disableSubmit: boolean
  value: string
}

export const MessageInput = ({ value, disabled, disableSubmit, onChangeText, onSubmit }: Props) => {
  const onEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) =>
    onChangeText(e.nativeEvent.text?.trim())
  const onBlurHandler = () => {
    if (onChangeText && value) onChangeText(value.trim())
  }
  const onSubmitHandler = () => (!disableSubmit ? onSubmit(value) : null)
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
        onBlur={onBlurHandler}
        autoCapitalize="sentences"
        placeholder={i18n('chat.yourMessage')}
        {...{ value, onChangeText, onEndEditing }}
      />
      <Pressable style={tw`px-2 py-3`} onPress={onSubmitHandler}>
        <Icon id="arrowRightCircle" size={24} color={tw`text-info-light`.color} />
      </Pressable>
    </View>
  )
}
