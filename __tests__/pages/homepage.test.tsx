import HomeView from "@/modules/home/ui/view/home-view";
import { render, screen } from "@testing-library/react";

jest.mock("@/modules/home/ui/view/home-view", () => {
  const MockHomeView = () => <div>HomeView</div>;
  MockHomeView.displayName = "MockHomeView";
  return MockHomeView;
});

test("renders HomeView", () => {
  render(<HomeView />);
  screen.getByText("HomeView");
});
