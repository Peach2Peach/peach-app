import { View } from "react-native";
import { NewBubble } from "../../components/bubble/Bubble";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Section } from "./components/Section";

const escrowTypes: EscrowType[] = ['bitcoin', 'liquid']
type Props = {
  escrowType: EscrowType;
  setEscrowType: (type: EscrowType) => void;
};

export function EscrowTypeSelector({
  escrowType,
  setEscrowType,
}: Props) {
  return (
    <Section.Container style={tw`success-mild-1`}>
      <Section.Title>{i18n('escrowType')}</Section.Title>
      <View style={tw`flex-row items-center gap-10px`}>
        {escrowTypes.map(type => 
          <NewBubble
            color="green"
            ghost={escrowType !== type}
            onPress={()=> setEscrowType(type)}
          >
            {i18n(`escrow.${type}`)}
          </NewBubble>
        )}
      </View>
    </Section.Container>
  );
}
