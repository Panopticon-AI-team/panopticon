import { aircraftCppTests } from "./Aircraft.cpp.ts";
import { scenarioCppTests } from "./Scenario.cpp.ts";
import { sideCppTests } from "./Side.cpp.ts";

export function runCppTests() {
  aircraftCppTests();
  sideCppTests();
  scenarioCppTests();
}
