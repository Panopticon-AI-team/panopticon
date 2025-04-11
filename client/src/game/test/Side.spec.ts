import Side from "@/game/Side";

describe("Side", () => {
  test("a Side is instantiated correctly", () => {
    const sideBlue = new Side({
      id: "1234",
      name: "BLUE",
      color: "blue",
    });
    expect(sideBlue.name).toBe("BLUE");
    expect(sideBlue.color).toBe("blue");
    expect(sideBlue.id).toBe("1234");
    expect(sideBlue.totalScore).toBe(0);
  });
});
