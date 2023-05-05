import { account1 } from '../../tests/unit/data/accountData'
import { useTemporaryAccount } from './useTemporaryAccount'

describe('useTemporaryAccount', () => {
  afterEach(() => {
    useTemporaryAccount.setState({ temporaryAccount: undefined })
  })

  it('should set visible temporary account', () => {
    useTemporaryAccount.getState().setTemporaryAccount(account1)
    expect(useTemporaryAccount.getState().temporaryAccount).toEqual(account1)
  })
})
