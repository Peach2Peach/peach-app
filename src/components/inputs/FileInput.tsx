import React, { ReactElement } from 'react'
import {
  Pressable,
  View,
} from 'react-native'
import { error } from '../../utils/log'
import DocumentPicker from '../../utils/fileSystem/DocumentPicker'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Shadow, Text } from '..'
import { innerShadow } from '../../utils/layout'


export type FileData = {
  name: string,
  content: string
}

const selectFile = async () => {
  try {
    const result = await DocumentPicker.pick()
    try {
      if (result.content) {
        return {
          name: '', // TODO get filename
          content: result.content
        }
      }
    } catch (e) {
      error('File could not be read', e)
    }
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      throw err
    }
  }
  return {
    name: '',
    content: null
  }
}
type InputProps = ComponentProps & {
  fileName?: string|null,
  autoCorrect?: boolean
  isValid?: boolean,
  errorMessage?: string[]
  onChange?: Function,
  secureTextEntry?: boolean
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param [props.fileName] file name
 * @param [props.isValid] if true show valid state
 * @param [props.style] css style object
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @example
 * <FileInput
 *   onChange={setAddress}
 *   fileName={fileName}
 *   isValid={!isFieldInError('address')}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
export const FileInput = ({
  fileName,
  isValid,
  style,
  errorMessage = [],
  onChange
}: InputProps): ReactElement => <View>
  <Pressable
    style={[
      tw`flex h-10 border border-peach-1 rounded overflow-hidden`,
      isValid && fileName ? tw`border-green` : {},
      errorMessage.length > 0 ? tw`border-red` : {},
      style || {}
    ]}
    onPress={async () => onChange ? onChange(await selectFile()) : null}
  >
    <Shadow style={tw`w-full rounded`} shadow={innerShadow}>
      <Text style={[tw`h-10 p-2 text-grey-1 text-lg`]}>
        {fileName || i18n('form.file')}
      </Text>
    </Shadow>
  </Pressable>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default FileInput