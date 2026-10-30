import { describe, it, expect } from "vitest";
import { parseMathSegments, hasMathFormula } from "../src/components/common/MathRenderer";

describe("MathRenderer parser tests", () => {
  it("detects math formula properly", () => {
    expect(hasMathFormula("Không có công thức")).toBe(false);
    expect(hasMathFormula("Có công thức $\\Delta U = A + Q$")).toBe(true);
    expect(hasMathFormula("$$x^2 + y^2 = r^2$$")).toBe(true);
  });

  it("parses inline math correctly like user's question", () => {
    const text = "Theo nguyên lý I nhiệt động lực học $\\Delta U = A + Q$. đồng thời sinh công thì";
    const segments = parseMathSegments(text);

    expect(segments.length).toBe(3);
    expect(segments[0].type).toBe("text");
    expect(segments[0].content).toBe("Theo nguyên lý I nhiệt động lực học ");

    expect(segments[1].type).toBe("inline");
    expect(segments[1].content).toBe("\\Delta U = A + Q");
    expect(segments[1].html).toContain("katex");
    expect(segments[1].html).toContain("Δ");

    expect(segments[2].type).toBe("text");
    expect(segments[2].content).toBe(". đồng thời sinh công thì");
  });

  it("parses multiple inline math options properly", () => {
    const text = "$Q > 0$ và $A < 0$.";
    const segments = parseMathSegments(text);

    expect(segments.length).toBe(4);
    expect(segments[0].type).toBe("inline");
    expect(segments[0].content).toBe("Q > 0");

    expect(segments[1].type).toBe("text");
    expect(segments[1].content).toBe(" và ");

    expect(segments[2].type).toBe("inline");
    expect(segments[2].content).toBe("A < 0");

    expect(segments[3].type).toBe("text");
    expect(segments[3].content).toBe(".");
  });

  it("handles block math correctly", () => {
    const text = "Biểu thức tổng quát:\n$$\\int_0^1 f(x)dx$$\nKết thúc.";
    const segments = parseMathSegments(text);

    expect(segments.length).toBe(3);
    expect(segments[1].type).toBe("block");
    expect(segments[1].content).toBe("\\int_0^1 f(x)dx");
    expect(segments[1].html).toContain("katex-display");
  });

  it("safely handles empty and pure text without breaking", () => {
    expect(parseMathSegments("")).toEqual([]);
    const segments = parseMathSegments("Văn bản thuần túy");
    expect(segments.length).toBe(1);
    expect(segments[0].type).toBe("text");
    expect(segments[0].content).toBe("Văn bản thuần túy");
  });
});
