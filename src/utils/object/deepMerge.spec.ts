import { deepMerge } from "./deepMerge";

type AnObject = Record<string, Record<string, number>>;
describe("deepMerge", () => {
  it("should deep merge two objects", () => {
    const target: AnObject = { a: { b: 1, c: 2 } };
    const source: AnObject = { a: { c: 3, d: 4 } };
    expect(deepMerge(target, source)).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });
  it("should not modify the original objects", () => {
    const target: AnObject = { a: { b: 1, c: 2 } };
    const source: AnObject = { a: { c: 3, d: 4 } };

    deepMerge(target, source);
    expect(target).toEqual({ a: { b: 1, c: 2 } });
    expect(source).toEqual({ a: { c: 3, d: 4 } });
  });
});
