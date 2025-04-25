import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import tw from "../../../styles/tailwind";

type Props = {
  children: React.ReactNode;
  isSliding: boolean;
  button: React.ReactNode;
  header: React.ReactNode;
};

export function PreferenceScreen({
  children,
  button,
  isSliding,
  header,
}: Props) {
  return (
    <Screen header={header}>
      <PeachScrollView
        contentStyle={tw`gap-6`}
        scrollEnabled={!isSliding}
        showsVerticalScrollIndicator
      >
        {children}
      </PeachScrollView>
      {button}
    </Screen>
  );
}
