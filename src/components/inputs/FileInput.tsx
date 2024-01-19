import { useState } from 'react'
import { Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { readFileInChunks } from '../../utils/file/readFileInChunks'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log/error'
import { Input } from './Input'

type FileData = {
  name: string
  content: string
}

type Props = {
  fileName?: string
  onChange?: (file: FileData) => void
}

export const FileInput = ({ fileName, onChange }: Props) => {
  const [loading, setLoading] = useState(false)
  const selectFile = async (): Promise<FileData> => {
    setLoading(true)
    try {
      const file = await DocumentPicker.pickSingle()
      try {
        if (!file.uri) {
          throw Error('File could not be read')
        }

        const uri = Platform.select({
          android: file.uri,
          ios: decodeURIComponent(file.uri)?.replace?.('file://', ''),
        }) as string

        const content = await readFileInChunks(uri)
        setLoading(false)
        return {
          name: file.name || '',
          content,
        }
      } catch (e) {
        setLoading(false)
        error('File could not be read', e)
        return {
          name: '',
          content: '',
        }
      }
    } catch (err: unknown) {
      setLoading(false)
      if (!DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        throw err
      }
      return {
        name: '',
        content: '',
      }
    }
  }

  const onPress = async () => {
    if (loading || !onChange) return
    onChange(await selectFile())
  }

  return (
    <Input
      value={fileName}
      onPressIn={onPress}
      icons={[['clipboard', onPress]]}
      disabled
      theme="inverted"
      placeholder={i18n('restoreBackup.decrypt.file')}
    />
  )
}
