import { act, renderHook } from "test-utils";
import { useInterruptibleFunction } from "./useInterruptibleFunction";

jest.useFakeTimers();
describe("useInterruptibleFunction", () => {
  const fn = jest.fn();
  const delay = 1000;
  const initialProps = { fn, delay };
  it("should call function after delay", () => {
    const { result } = renderHook(useInterruptibleFunction, { initialProps });
    result.current.interruptibleFn();
    expect(fn).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(delay));
    expect(fn).toHaveBeenCalled();
  });
  it("can interrupt function call", () => {
    const { result } = renderHook(useInterruptibleFunction, { initialProps });
    result.current.interruptibleFn();
    expect(fn).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(delay / 2));
    act(() => result.current.interrupt());
    act(() => jest.advanceTimersByTime(delay / 2));
    expect(fn).not.toHaveBeenCalled();
  });
});
