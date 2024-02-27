import { render } from 'test-utils';
import { SetInvoicePopup } from './SetInvoicePopup';

describe('SetInvoicePopup', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SetInvoicePopup amount={12345} miningFees={210} />);
    expect(toJSON()).toMatchSnapshot();
  });
})