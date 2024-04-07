import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "../App";

// needed due to https://github.com/ZeeCoder/use-resize-observer/issues/40
// TODO: see if there are other ways around this
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

test("renders default map page", () => {
  render(<App />);
  const blueSideButton = screen.getByText(/BLUE/i);
  expect(blueSideButton).toBeInTheDocument();
});
