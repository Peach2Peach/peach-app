import { ReactElement } from 'react';

import { Checkbox } from '../../../../components'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & { checkBoxProps: { checked: boolean; onPress: () => void } }

export const ReadAndUnderstood = ({ style, checkBoxProps }: Props): ReactElement => (
  <Checkbox {...checkBoxProps} style={style} text={i18n('settings.backups.seedPhrase.readAndUnderstood')} />
)
