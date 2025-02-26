import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import TestUi from "./test-ui";

describe("test-fc1", () => {
  beforeEach(() => {
    render(<TestUi />);
  });

  it("render the h1 tag", () => {
    const text = screen.getByRole("heading", { level: 1 });
    expect(text).toBeInTheDocument();
  });

  it("render the description of the page", () => {
    const text = screen.getByText(/Hello World/i);
    expect(text).toBeInTheDocument();
  });
});

describe("test-fc2", () => {
  beforeEach(() => {
    render(<TestUi />);
  });

  it("render h2 tag", () => {
    const text = screen.getByRole("heading", { level: 2 });
    expect(text).toBeInTheDocument();
  });
});
