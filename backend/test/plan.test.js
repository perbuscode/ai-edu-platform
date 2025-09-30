import request from "supertest";
import app from "../src/server.js";
import { jest } from "@jest/globals";

describe("POST /plan (mock)", () => {
  it("returns a plan JSON with required fields", async () => {
    const res = await request(app)
      .post("/plan")
      .send({ objective: "Power BI", level: "Junior", hoursPerWeek: 6, weeks: 8 })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("plan");
    const p = res.body.plan;
    expect(p).toHaveProperty("title");
    expect(p).toHaveProperty("blocks");
    expect(Array.isArray(p.blocks)).toBe(true);
  });
});

describe("POST /plan validations and errors", () => {
  const orig = { MOCK_PLAN: process.env.MOCK_PLAN, OPENAI_API_KEY: process.env.OPENAI_API_KEY };

  afterEach(() => {
    process.env.MOCK_PLAN = orig.MOCK_PLAN;
    if (orig.OPENAI_API_KEY === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = orig.OPENAI_API_KEY;
    jest.restoreAllMocks();
  });

  it("returns 400 with { error, errorId } on invalid payload", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const res = await request(app)
      .post("/plan")
      .send({ objective: "", level: "", hoursPerWeek: "abc", weeks: 0 })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("errorId");
    expect(typeof res.body.errorId).toBe("string");
    expect(warnSpy).toHaveBeenCalled();
  });

  it("returns 500 with { error, errorId } when OpenAI call fails", async () => {
    process.env.MOCK_PLAN = "0";
    delete process.env.OPENAI_API_KEY; // force makeOpenAIClient to throw
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app)
      .post("/plan")
      .send({ objective: "X", level: "Junior", hoursPerWeek: 6, weeks: 8 })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "No se pudo generar el plan");
    expect(res.body).toHaveProperty("errorId");
    const { errorId } = res.body;
    expect(typeof errorId).toBe("string");
    // Ensure our error log was emitted with the errorId in the message
    const found = errSpy.mock.calls.some(
      call => typeof call[0] === "string" && call[0].includes(`[POST /plan][${errorId}]`),
    );
    expect(found).toBe(true);
  });

  it("returns mock plan when ?mock=1 even without OPENAI_API_KEY", async () => {
    process.env.MOCK_PLAN = "0";
    delete process.env.OPENAI_API_KEY; // avoid real client
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    const res = await request(app)
      .post("/plan?mock=1")
      .send({ objective: "QA", level: "Junior", hoursPerWeek: 4, weeks: 6 })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("plan");
    const p = res.body.plan;
    expect(p).toHaveProperty("title");
    expect(p).toHaveProperty("durationWeeks", 6);
    expect(Array.isArray(p.blocks)).toBe(true);
    expect(infoSpy).toHaveBeenCalled();
  });
});
