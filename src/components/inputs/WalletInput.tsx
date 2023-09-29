import { enforceWalletFormat } from '../../utils/format/enforceWalletFormat'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const WalletInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    placeholder={i18n('form.wallet.placeholder')}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (wallet: string) => onChange(enforceWalletFormat(wallet)) : undefined}
    onSubmit={onSubmit ? (wallet: string) => onSubmit(enforceWalletFormat(wallet)) : undefined}
  />
)
