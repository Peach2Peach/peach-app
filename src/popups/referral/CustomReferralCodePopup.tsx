import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Input } from "../../components/inputs/Input";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useValidatedState } from "../../hooks/useValidatedState";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { getMessages } from "../../utils/validation/getMessages";
import { useTranslate } from "@tolgee/react";

const referralCodeRules = {
  required: true,
  referralCode: true,
};
export function CustomReferralCodePopup() {
  const [referralCodeTaken, setReferralCodeTaken] = useState(false);
  const { t } = useTranslate("settings");

  const [referralCode, setReferralCode, isValidReferralCode, inputErrors] =
    useValidatedState<string>("", referralCodeRules);

  const referralCodeValid = useMemo(
    () => isValidReferralCode && !referralCodeTaken,
    [isValidReferralCode, referralCodeTaken],
  );
  const referralCodeErrors = useMemo(() => {
    let errs = inputErrors;
    if (referralCodeTaken) {
      errs = [...errs, getMessages().referralCodeTaken];
    }
    return errs;
  }, [inputErrors, referralCodeTaken]);

  const updateReferralCode = useCallback(
    (code: string) => {
      setReferralCode(code);
      setReferralCodeTaken(false);
    },
    [setReferralCode],
  );

  const { mutate } = useRedeemReferralCode();

  const redeemReferralCode = () => {
    mutate(referralCode, {
      onError: (error) => {
        if (error.message === "ALREADY_TAKEN") {
          setReferralCodeTaken(true);
        }
      },
    });
  };

  return (
    <PopupComponent
      title={t("settings.referrals.customReferralCode.popup.title")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>
            {t("settings.referrals.customReferralCode.popup.text")}
          </PeachText>
          <Input
            style={tw`bg-primary-background-dark`}
            placeholder={t("form.referral.placeholder", { ns: "form" })}
            value={referralCode}
            onChangeText={updateReferralCode}
            autoCapitalize="characters"
            errorMessage={referralCodeErrors}
          />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={t("settings.referrals.customReferralCode.popup.redeem")}
            iconId="checkSquare"
            onPress={redeemReferralCode}
            disabled={!referralCodeValid}
            reverseOrder
          />
        </>
      }
    />
  );
}

function useRedeemReferralCode() {
  const showErrorBanner = useShowErrorBanner();
  const setPopup = useSetPopup();

  return useMutation({
    mutationFn: async (code: string) => {
      const { error: redeemError } =
        await peachAPI.private.user.redeemReferralCode({ code });
      if (redeemError) throw new Error(redeemError.error);
    },
    onError: (error) => {
      showErrorBanner(error.message);
    },
    onSuccess: (_data, code) => {
      setPopup(<ReferralCodeRedeemedPopup referralCode={code} />);
    },
  });
}

function ReferralCodeRedeemedPopup({ referralCode }: { referralCode: string }) {
  const { t } = useTranslate("settings");
  return (
    <PopupComponent
      title={t("settings.referrals.customReferralCode.popup.title")}
      content={
        <ParsedPeachText
          parse={[
            {
              pattern: new RegExp(referralCode, "u"),
              style: tw`text-primary-main`,
            },
          ]}
        >
          {t("settings.referrals.customReferralCode.popup.success", {
            refCode: referralCode,
          })}
        </ParsedPeachText>
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
