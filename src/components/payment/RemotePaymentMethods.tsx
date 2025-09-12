import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { IconType } from "../../assets/icons";
import { PAYMENTCATEGORIES } from "../../paymentMethods";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { keys } from "../../utils/object/keys";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { usePaymentMethods } from "../../views/addPaymentMethod/usePaymentMethodInfo";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { LinedText } from "../ui/LinedText";
import { PaymentDetailsCheckbox } from "./PaymentDetailsCheckbox";
import { PaymentDataKeyFacts } from "./components/PaymentDataKeyFacts";
import { useRemovePaymentData } from "./hooks/useRemovePaymentData";

const paymentCategoryIcons: Record<PaymentCategory, IconType | ""> = {
  bankTransfer: "inbox",
  onlineWallet: "cloud",
  giftCard: "creditCard",
  nationalOption: "flag",
  cash: "",
  global: "globe",
};

type Props = {
  isEditing: boolean;
  editItem: (data: PaymentData) => void;
  toggle: (value: string) => void;
  isSelected: (item: { value: string }) => boolean;
};

export const RemotePaymentMethods = ({
  isEditing,
  editItem,
  toggle,
  isSelected,
}: Props) => {
  const { isDarkMode } = useThemeStore();
  const paymentData = usePaymentDataStore(
    useShallow((state) => Object.values(state.paymentData)),
  );
  const [, setRandom] = useState(0);
  const { mutate: removePaymentData } = useRemovePaymentData();
  const deletePaymentData = (data: PaymentData) => {
    removePaymentData(data.id, {
      onSuccess: () => {
        setRandom(Math.random());
      },
    });
  };
  const { data: paymentMethods } = usePaymentMethods();
  return paymentData.filter((item) => !isCashTrade(item.type)).length === 0 ? (
    <PeachText
      style={tw.style(
        `text-center h6`,
        isDarkMode ? "text-backgroundLight-light" : "text-black-50",
      )}
    >
      {i18n("paymentMethod.empty")}
    </PeachText>
  ) : (
    <View style={tw`gap-4`}>
      {keys(PAYMENTCATEGORIES)
        .map((category) => ({
          category,
          checkboxes: paymentData
            .filter(
              (item) =>
                !item.hidden &&
                !isCashTrade(item.type) &&
                PAYMENTCATEGORIES[category]?.includes(item.type) &&
                paymentMethods?.find(({ id }) => id === item.type),
            )
            .sort((a, b) => (a.id > b.id ? 1 : -1)),
        }))
        .filter(({ checkboxes }) => checkboxes.length)
        .map(({ category, checkboxes }, i) => (
          <View key={category} style={i > 0 ? tw`mt-8` : {}}>
            <LinedText style={tw`gap-1 pb-3`}>
              <PeachText
                style={tw.style(
                  `h6`,
                  isDarkMode ? "text-backgroundLight-light" : "text-black-65",
                )}
              >
                {i18n(`paymentCategory.${category}`)}
              </PeachText>
              {paymentCategoryIcons[category] !== "" && (
                <Icon
                  color={tw.color(
                    isDarkMode ? "backgroundLight-light" : "black-65",
                  )}
                  id={paymentCategoryIcons[category] as IconType}
                />
              )}
            </LinedText>
            <View style={tw`gap-4`}>
              {checkboxes.map((item) => {
                const currenciesAreValid = !!paymentMethods
                  ?.find(({ id }) => id === item.type)
                  ?.currencies.some((c) => item.currencies.includes(c));
                const hasData = keys(cleanPaymentData(item)).some(
                  (key) => item[key],
                );
                const isValid = currenciesAreValid && hasData;
                return (
                  <View key={item.id}>
                    {isValid ? (
                      <View style={tw`gap-1`}>
                        <PaymentDetailsCheckbox
                          onPress={() =>
                            isEditing ? editItem(item) : toggle(item.id)
                          }
                          item={{
                            value: item.id,
                            display: (
                              <PeachText style={tw`subtitle-1`}>
                                {item.label}
                              </PeachText>
                            ),
                          }}
                          checked={isSelected({ value: item.id })}
                          editing={isEditing}
                        />
                        <PaymentDataKeyFacts paymentData={item} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => deletePaymentData(item)}
                        style={tw`flex-row justify-between`}
                      >
                        <PeachText style={tw`text-error-main`}>
                          {item.label}
                        </PeachText>
                        <Icon
                          id="trash"
                          color={tw.color(
                            isDarkMode ? "backgroundLight-light" : "black-65",
                          )}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
    </View>
  );
};
