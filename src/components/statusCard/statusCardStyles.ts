import tw from "../../styles/tailwind";

export const statusCardStyles = {
  bg: {
    primary: tw`bg-primary-main`,
    error: tw`bg-error-main`,
    success: tw`bg-success-main`,
    "primary-mild": tw`bg-primary-mild-1`,
    warning: tw`bg-warning-main`,
    info: tw`bg-info-light`,
    black: tw`bg-black-50`,
  },
  border: {
    primary: "border-primary-main",
    error: "border-error-main",
    success: "border-success-main",
    "primary-mild": "border-primary-mild-1",
    warning: "border-warning-main",
    info: "border-info-light",
    black: "border-black-50",
  },
  text: {
    primary: "text-primary-background-light",
    error: "text-primary-background-light",
    success: "text-primary-background-light",
    "primary-mild": "text-black-65",
    warning: "text-black-100",
    info: "text-black-100",
    black: "text-primary-background-light",
  },
};
