import { Ref, useEffect, useMemo, useState } from 'react'
import {
  ColorValue,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { PeachText } from '../text/Text'

const themes = {
  default: {
    label: tw`text-black-1`,
    text: 'text-black-1',
    textError: 'text-black-1',
    border: tw`border-black-1`,
    borderError: tw`border-error-main`,
    borderDisabled: tw`text-black-2`,
    bg: tw`bg-primary-background-light`,
    bgError: tw`bg-primary-background-light`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-error-main`,
    placeholder: 'text-black-4',
    optional: tw`text-black-4`,
  },
  inverted: {
    label: tw`text-primary-background-light`,
    text: 'text-primary-background-light',
    textError: 'text-error-main',
    border: tw`border-primary-background-light`,
    borderError: tw`border-primary-background-light`,
    borderDisabled: tw`border-primary-background-light`,
    bg: tw`bg-transparent`,
    bgError: tw`bg-primary-background-light`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-primary-background-light`,
    placeholder: 'text-primary-mild-1',
    optional: tw`text-black-4`,
  },
}

type IconActionPair = [IconType, () => void]
export type InputProps = ComponentProps &
  Omit<TextInputProps, 'onChange' | 'onEndEditing' | 'onSubmit' | 'onFocus' | 'onBlur'> & {
    theme?: 'default' | 'inverted'
    label?: string
    icons?: IconActionPair[]
    iconColor?: ColorValue
    inputStyle?: ViewStyle | ViewStyle[]
    required?: boolean
    disabled?: boolean
    errorMessage?: string[]
    onChange?: (val: string) => void
    onEndEditing?: (val: string) => void
    onSubmit?: (val: string) => void
    onFocus?: () => void
    onBlur?: (val: string | undefined) => void
    reference?: Ref<TextInput>
  }

// eslint-disable-next-line max-lines-per-function, complexity
export const Input = ({
  value,
  label,
  icons = [],
  iconColor,
  required = true,
  multiline = false,
  disabled = false,
  errorMessage = [],
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onEndEditing,
  onPressIn,
  secureTextEntry,
  autoCapitalize,
  autoCorrect = false,
  style,
  inputStyle,
  theme = 'default',
  reference,
  ...inputProps
}: InputProps) => {
  const styles = useMemo(() => themes[theme], [theme])
  const [touched, setTouched] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const showError = errorMessage.length > 0 && !disabled && touched
  const toggleShowSecret = () => setShowSecret((b) => !b)
  const inputIcons: IconActionPair[] = useMemo(
    () => (secureTextEntry ? [...icons, [showSecret ? 'eyeOff' : 'eye', toggleShowSecret]] : icons),
    [icons, secureTextEntry, showSecret],
  )

  useEffect(() => {
    if (value) setTouched(true)
  }, [value])

  const onChangeText = (val: string) => {
    if (onChange) onChange(val)
  }
  const onEndEditingHandler = onEndEditing
    ? (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      onEndEditing(e.nativeEvent.text?.trim())
      setTouched(true)
    }
    : () => null
  const onSubmitEditing = onSubmit
    ? (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmit(e.nativeEvent.text?.trim())
      setTouched(true)
    }
    : () => null
  const onFocusHandler = () => (onFocus ? onFocus() : null)
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur(value)
  }

  return (
    <View>
      {!!label && (
        <PeachText style={[tw`pl-2 input-label`, tw.style(styles.text)]}>
          {label}
          {!required && (
            <PeachText style={[tw`font-medium input-label`, tw.style(styles.placeholder)]}>{` (${i18n(
              'form.optional',
            )})`}</PeachText>
          )}
        </PeachText>
      )}
      <View
        style={[
          tw`flex flex-row items-center justify-between w-full gap-1 px-3`,
          tw`overflow-hidden border rounded-xl`,
          disabled ? styles.bgDisabled : styles.bg,
          disabled ? styles.borderDisabled : styles.border,
          showError && styles.bgError,
          showError && styles.borderError,
          showError ? tw`border-2` : tw`my-px`,
          style,
        ]}
      >
        <TextInput
          style={[
            tw`shrink w-full h-10 py-0 input-text`,
            tw.style(value ? styles.text : styles.placeholder),
            showError && tw.style(styles.textError),
            !showError && tw`border border-transparent`,
            multiline && tw`flex justify-start h-full pt-2`,
            !!inputStyle && inputStyle,
          ]}
          value={value}
          ref={reference ? reference : null}
          placeholderTextColor={tw.color(styles.placeholder)}
          allowFontScaling={false}
          removeClippedSubviews={false}
          editable={!disabled}
          onChangeText={onChangeText}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onEndEditing={onEndEditingHandler}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={false}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onPressIn={onPressIn}
          secureTextEntry={secureTextEntry && !showSecret}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={autoCorrect}
          {...inputProps}
        />
        <View style={tw`flex flex-row gap-4`}>
          {inputIcons.map(([icon, action], index) => (
            <Pressable onPress={action} key={`inputIcon-${icon}-${index}`}>
              <Icon
                id={icon}
                style={tw`w-5 h-5`}
                color={iconColor ? iconColor : tw.color(showError ? styles.textError : styles.text)}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <PeachText style={[tw`mt-1 ml-3 tooltip`, styles.error]}>{showError ? errorMessage[0] : ' '}</PeachText>
    </View>
  )
}
