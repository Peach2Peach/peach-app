import { act, renderHook } from "test-utils";
import { useValidatedState } from "./useValidatedState";

const requiredRule = { required: true };
describe("useValidatedState", () => {
  it("returns state value, setter, isValid, errors and isPristine accordingly", () => {
    const { result } = renderHook(() => useValidatedState("", requiredRule));
    const [value, setValue, valueValid, valueErrors] = result.current;
    expect(value).toBe("");
    expect(setValue).toBeInstanceOf(Function);
    expect(valueValid).toBeFalsy();
    expect(valueErrors).toStrictEqual(["this field is required"]);
  });
  it("returns state value, setter, isValid, errors and isPristine with default", () => {
    const { result } = renderHook(() =>
      useValidatedState("default", requiredRule),
    );
    const [value, setValue, valueValid, valueErrors] = result.current;
    expect(value).toBe("default");
    expect(setValue).toBeInstanceOf(Function);
    expect(valueValid).toBeTruthy();
    expect(valueErrors).toHaveLength(0);
  });

  it("updates the state correctly", async () => {
    const { result } = renderHook(() =>
      useValidatedState<string>("", requiredRule),
    );
    const [value, setValue] = result.current;
    expect(value).toBe("");

    await act(() => {
      setValue("newValue");
    });

    expect(result.current[0]).toBe("newValue");
    expect(result.current[2]).toBeTruthy();
    expect(result.current[3]).toHaveLength(0);
  });
});
