import { format } from "$utils/string"

test("string", () => {
  expect(format("1{a}2{b}3{c}", { a: 0, b: 9, c: 8 })).toBe("102938")
})

export {}
