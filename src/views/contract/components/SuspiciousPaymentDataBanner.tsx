import { ErrorBox } from "../../../components/ui/ErrorBox";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

type Props = {
  counterparty: ContractViewer;
};

export function SuspiciousPaymentDataBanner({ counterparty }: Props) {
  return (
    <ErrorBox style={tw`mb-sm`}>
      {i18n(`contract.suspiciousPaymentData.${counterparty}`)}
    </ErrorBox>
  );
}
