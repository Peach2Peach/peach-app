import { Image, View } from "react-native";
import loadingAnimation from "../../../assets/animated/logo-rotate.gif";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const EmptyTransactionHistory = () => {
  const { t } = useTranslate("wallet");

  return (
    <View style={tw`items-center justify-center h-full gap-8`}>
      <Image
        source={loadingAnimation}
        style={tw`w-118px h-130px`}
        resizeMode="cover"
      />

      <PeachText style={tw`subtitle-1 text-black-65`}>
        {t("wallet.transactionHistory.empty")}
      </PeachText>
    </View>
  );
};
