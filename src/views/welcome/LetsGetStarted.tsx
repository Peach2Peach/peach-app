import { Linking, View } from "react-native";
import tw from "../../styles/tailwind";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getInstallReferrer } from "react-native-device-info";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { PeachText } from "../../components/text/PeachText";
import { useSetToast } from "../../components/toast/Toast";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { peachAPI } from "../../utils/peachAPI";
import { tolgee } from "../../tolgee";
import { useTranslate } from "@tolgee/react";

const referralCodeRules = { referralCode: true };
export const LetsGetStarted = () => {
  const navigation = useStackNavigation();
  const showError = useShowErrorBanner();
  const setToast = useSetToast();
  const [referralCode, setReferralCode, referralCodeIsValid] =
    useValidatedState<string>("", referralCodeRules);
  const [willUseReferralCode, setWillUseReferralCode] = useState(false);

  const handleRefCode = useCallback(
    ({ url }: { url: string | null }) => {
      if (!url) return;
      const link = new URL(url).searchParams.get("link");
      if (!link) return;
      const code = new URL(link).searchParams.get("code");
      if (!code) return;
      setReferralCode(code);
      setWillUseReferralCode(true);
    },
    [setReferralCode],
  );

  useEffect(() => {
    const listener = Linking.addEventListener("url", handleRefCode);
    return () => listener.remove();
  }, [handleRefCode, setReferralCode]);

  useEffect(() => {
    Linking.getInitialURL().then((url) => handleRefCode({ url }));
  }, [handleRefCode]);

  useEffect(() => {
    getInstallReferrer().then((ref) => {
      if (!ref || ref === "unknown") return;
      setReferralCode((prev) => prev || ref);
      setWillUseReferralCode(true);
    });
  }, [setReferralCode]);

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
  const { t } = useTranslate();

  return (
    <View style={tw`items-center flex-1 gap-4 shrink`}>
      <View style={tw`justify-center gap-4 grow`}>
        <PeachText
          style={[tw`text-center h5 text-primary-background-light`, tw`md:h4`]}
        >
          {t("welcome.letsGetStarted.title", { ns: "welcome" })}
        </PeachText>

        <View>
          <PeachText style={tw`text-center text-primary-background-light`}>
            {t("newUser.referralCode")}
          </PeachText>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <View style={tw`h-14`}>
              <Input
                style={tw`w-40 mt-2`}
                theme="inverted"
                maxLength={16}
                placeholder={tolgee
                  .t("form.optional", { ns: "form" })
                  .toUpperCase()}
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
              {t(willUseReferralCode ? "referrals.used" : "referrals.use", {
                ns: "referral",
              })}
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
          {t("newUser")}
        </Button>
        <Button onPress={goToRestoreBackup} iconId="save" ghost>
          {t("restore")}
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
