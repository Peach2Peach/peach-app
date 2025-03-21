import tw from "../../../styles/tailwind";
import { getBackgroundColor } from "./getBackgroundColor";

describe("getBackgroundColor", () => {
  it("should return the correct background color for primary bubble", () => {
    expect(getBackgroundColor({ color: "primary", ghost: false })).toEqual(
      tw`bg-primary-main`,
    );
    expect(getBackgroundColor({ color: "primary", ghost: true })).toEqual(
      tw`bg-primary-background-light-color`,
    );
  });
  it("should return the correct background color for primary-mild bubble", () => {
    expect(getBackgroundColor({ color: "primary-mild", ghost: false })).toEqual(
      tw`bg-primary-background-dark-color`,
    );
    expect(getBackgroundColor({ color: "primary-mild", ghost: true })).toEqual(
      tw`bg-primary-background-light-color`,
    );
  });
  it("should return the correct background color for gray bubble", () => {
    expect(getBackgroundColor({ color: "gray", ghost: false })).toEqual({
      backgroundColor: "transparent",
    });
    expect(getBackgroundColor({ color: "gray", ghost: true })).toEqual({
      backgroundColor: "transparent",
    });
  });
  it("should return the correct background color for black bubble", () => {
    expect(getBackgroundColor({ color: "black", ghost: false })).toEqual({
      backgroundColor: "transparent",
    });
    expect(getBackgroundColor({ color: "black", ghost: true })).toEqual({
      backgroundColor: "transparent",
    });
  });
});
