import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomeNavbar from ".";
import { SidebarProvider } from "@/components/ui/sidebar";

describe("HomeNavbar", () => {
  beforeEach(() => {
    render(
      <SidebarProvider>
        <HomeNavbar />
      </SidebarProvider>
    );
  });

  it("should render the sidebar trigger", () => {
    const sidebarTrigger = screen.getByRole("button", {
      name: /Toggle Sidebar/i,
    });
    expect(sidebarTrigger).toBeInTheDocument();
    expect(sidebarTrigger).toHaveAttribute("data-sidebar", "trigger");
  });

  it("should render the logo and navigation link", () => {
    const logoLink = screen.getByRole("link", { name: /YouTube/i });
    expect(logoLink).toHaveAttribute("href", "/");
    const logoImage = screen.getByRole("img", { name: /Logo/i });
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/logo.png");
    expect(logoImage).toHaveAttribute("alt", "Logo");
  });

  it("should render the search input", () => {
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");
    // Test input functionality
    fireEvent.change(searchInput, { target: { value: "Test search" } });
    expect(searchInput).toHaveValue("Test search");
  });

  it("should render the right section", () => {
    const rightSection = screen.getByText(/Test/i);
    expect(rightSection).toBeInTheDocument();
  });

  // Optional: Test for sidebar toggle functionality
  it("should toggle sidebar when trigger is clicked", () => {
    const sidebarTrigger = screen.getByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(sidebarTrigger);
    // You can also use userEvent from @testing-library/user-event
    // Depending on your sidebar implementation, you might need to check the sidebar state
    // This part may need to be adjusted based on how the sidebar context is managed
    // For example:
    expect(sidebarTrigger).toHaveAttribute("aria-expanded", "true");
  });
});
