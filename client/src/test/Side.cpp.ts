import Simulation, { Side } from "emscripten_dist/simulation.js";

export async function createSide(): Promise<Side> {
  return await Simulation().then((module) => {
    const id = "Test ID";
    const name = "Test Name";
    const color = "Test Color";
    const totalScore = 100;
    const sideConstructionParameters = {
      id: id,
      name: name,
      color: color,
      totalScore: totalScore,
    };
    const side = new module.Side(sideConstructionParameters);
    return side;
  });
}

function createSideTest() {
  createSide().then((side) => {
    console.log("createSideTest side: ", side);
  });
}

export function sideCppTests() {
  createSideTest();
}
