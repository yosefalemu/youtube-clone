import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AuthButton from "./ui/auth-button";

describe("test-auth-button", () => {
  beforeEach(() => {
    render(<AuthButton />);
  });
  it("button-valid-text-functionality", () => {
    const signInButton = screen.getByRole("button", { name: "Sign in" });
    fireEvent.click(signInButton);
  });
});
