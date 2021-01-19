import { arrify } from "../src/get-help";

describe("arrify()", () => {
  it("should return empty arrayif value is undefined.", () => {
    expect(arrify()).toEqual([]);
  });
});
