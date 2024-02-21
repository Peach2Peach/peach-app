import { View } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";
import { MeansOfPayment } from "./MeansOfPayment";
import { tolgee } from "../../tolgee";

export const SummaryCard = ({ children }: ComponentProps) => (
  <View
    style={tw`items-center gap-4 px-5 border border-black-10 rounded-2xl py-7 bg-primary-background-light`}
  >
    {children}
  </View>
);

const SummarySection = ({ children }: ComponentProps) => (
  <View style={tw`items-center gap-1`}>{children}</View>
);

SummaryCard.Section = SummarySection;

const PaymentMethods = ({
  meansOfPayment,
}: {
  meansOfPayment: MeansOfPayment;
}) => (
  <SummaryCard.Section>
    <PeachText style={tw`text-center text-black-65`}>
      {tolgee.t("offer.summary.withTheseMethods", { ns: "offer" })}
    </PeachText>
    <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`self-stretch`} />
  </SummaryCard.Section>
);

SummaryCard.PaymentMethods = PaymentMethods;
