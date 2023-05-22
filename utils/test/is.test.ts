import { describe, test } from "@jest/globals";
import { isDef } from "../is";
import { expect } from "@jest/globals";


describe("test is file all method", () => {
    test("isDef", () => {
        expect(isDef(1)).toBeTruthy()
        expect(isDef(undefined)).toBeFalsy()
      });
})

