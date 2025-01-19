/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup.ts", // Global setup file
    include: ["src/**/*.spec.{js,jsx,ts,tsx}"], // Matches test files
  },
});
