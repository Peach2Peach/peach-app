import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('SendBitcoin', () => {
  it.todo('should render correctly')
  it.todo('should update the address on change')
  it.todo('should update the amount on change')
  it.todo('should set the amount to the peach wallet balance when clicking "send max"')
  it.todo('should not allow entering an amount higher than the available balance')
  it.todo('should update the fee rate on change')
  it.todo('should set the fee rate to undefined when selecting "custom"')
  it.todo('should update the custom fee rate on change')
  it.todo('should should the help popup when clicking on the questionmark in the header')
  it.todo('should open the confirmation popup when swiping the slider')
  it.todo('should disable the slider while the form is invalid')
})
