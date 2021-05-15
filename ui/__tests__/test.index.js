import { sum1, sum2 } from "../src/index"


test("placeholder test", () => {
  expect(sum1(1, 2)).toBe(3);
  expect(sum2(1, 2, 3)).toBe(6);
})
