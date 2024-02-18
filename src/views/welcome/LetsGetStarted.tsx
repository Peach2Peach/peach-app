import { View } from "react-native";
import tw from "../../styles/tailwind";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { PeachText } from "../../components/text/PeachText";
import { useSetToast } from "../../components/toast/Toast";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";

const referralCodeRules = { referralCode: true };
export const LetsGetStarted = () => {
  const route = useRoute<"welcome">();
  const navigation = useStackNavigation();
  const showError = useShowErrorBanner();
  const setToast = useSetToast();
  const [referralCode, setReferralCode, referralCodeIsValid] =
    useValidatedState(route.params?.referralCode || "", referralCodeRules);
  const [willUseReferralCode, setWillUseReferralCode] = useState(
    !!route.params?.referralCode,
  );

  const updateReferralCode = (code: string) => {
    if (referralCode !== code) setWillUseReferralCode(false);
    setReferralCode(code);
  };

  const { mutate: checkReferralCodeMutation } = useCheckReferralCode();

  const checkReferralCode = () => {
    setWillUseReferralCode(false);
    checkReferralCodeMutation(referralCode, {
      onError: (error) => showError(error.message),
      onSuccess: ({ valid }) => {
        setWillUseReferralCode(valid);
        setToast({
          msgKey: valid ? "referrals.myFavoriteCode" : "referrals.codeNotFound",
          color: "white",
        });
      },
    });
  };

  const goToNewUser = () => {
    navigation.navigate("newUser", {
      referralCode: willUseReferralCode ? referralCode : undefined,
    });
  };
  const goToRestoreBackup = () => navigation.navigate("restoreBackup");

  return (
    <View style={tw`items-center flex-1 gap-4 shrink`}>
      <View style={tw`justify-center gap-4 grow`}>
        <PeachText
          style={[tw`text-center h5 text-primary-background-light`, tw`md:h4`]}
        >
          {i18n("welcome.letsGetStarted.title")}
        </PeachText>

        <View>
          <PeachText style={tw`text-center text-primary-background-light`}>
            {i18n("newUser.referralCode")}
          </PeachText>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <View style={tw`h-14`}>
              <Input
                style={tw`w-40 mt-2`}
                theme="inverted"
                maxLength={16}
                placeholder={i18n("form.optional").toUpperCase()}
                onChangeText={updateReferralCode}
                onSubmitEditing={(e) => updateReferralCode(e.nativeEvent.text)}
                value={referralCode}
                autoCapitalize="characters"
              />
            </View>
            <Button
              style={tw`min-w-20 bg-primary-background-light`}
              textColor={tw.color("primary-main")}
              disabled={
                willUseReferralCode || !referralCode || !referralCodeIsValid
              }
              onPress={checkReferralCode}
            >
              {i18n(willUseReferralCode ? "referrals.used" : "referrals.use")}
            </Button>
          </View>
        </View>
      </View>

      <View style={tw`gap-2`}>
        <Button
          onPress={goToNewUser}
          style={tw`bg-primary-background-light`}
          textColor={tw.color("primary-main")}
          iconId="plusCircle"
        >
          {i18n("newUser")}
        </Button>
        <Button onPress={goToRestoreBackup} iconId="save" ghost>
          {i18n("restore")}
        </Button>
      </View>
    </View>
  );
};

function useCheckReferralCode() {
  return useMutation({
    mutationFn: async (code: string) => {
      const { result, error } = await peachAPI.public.user.checkReferralCode({
        code,
      });
      if (!result || error)
        throw new Error(error?.error || "Could not check referral code");
      return result;
    },
  });
}
