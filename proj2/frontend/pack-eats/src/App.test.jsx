import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the AppRoutes component
jest.mock("./routes/AppRoutes", () => () => (
    <div data-testid="app-routes">App Routes</div>
));

describe("App Component", () => {
    test("renders AppRoutes", () => {
        render(<App />);
        expect(screen.getByTestId("app-routes")).toBeInTheDocument();
    });

    test("renders AppRoutes only once", () => {
        render(<App />);
        const elements = screen.getAllByTestId("app-routes");
        expect(elements).toHaveLength(1);
    });
});
