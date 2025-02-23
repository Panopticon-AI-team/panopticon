import { aircraftCppTests } from "./Aircraft.cpp.ts";
import { scenarioCppTests } from "./Scenario.cpp.ts";

export function runCppTests() {
  aircraftCppTests();
  scenarioCppTests();
}
