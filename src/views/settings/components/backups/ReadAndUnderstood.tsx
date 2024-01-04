import { Checkbox } from '../../../../components/inputs/Checkbox'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & { checkBoxProps: { checked: boolean; onPress: () => void } }

export const ReadAndUnderstood = ({ style, checkBoxProps }: Props) => (
  <Checkbox {...checkBoxProps} style={style} text={i18n('settings.backups.seedPhrase.readAndUnderstood')} />
)
