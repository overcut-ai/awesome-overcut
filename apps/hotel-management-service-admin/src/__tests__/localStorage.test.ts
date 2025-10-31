import { render } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";

// Spy on localStorage methods
const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");
const getItemSpy = jest.spyOn(window.localStorage.__proto__, "getItem");

// Ensure spies don't affect actual implementation
setItemSpy.mockImplementation(() => undefined);
getItemSpy.mockImplementation(() => null);

describe("No localStorage usage", () => {
  it("renders login page without touching localStorage", () => {
    render(<LoginPage />);
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(getItemSpy).not.toHaveBeenCalled();
  });
});
