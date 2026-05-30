import request from "supertest";
import app from "./test-app";

describe("Core Flow E2E", () => {
  let token = "";
  let donationId = 0;

  it("should login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@mail.com",
        password: "admin123",
      });

    expect(response.status).toBe(200);

    token = response.body.data.token;

    expect(token).toBeDefined();
  });

  it("should create cash transaction", async () => {
    const response = await request(app)
      .post("/api/finance/cash")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "income",
        amount: 50000,
        category: "Donasi Jumat",
        description: "Testing cash",
        transactionDate: new Date(),
      });

    expect(response.status).toBe(201);
  });

  it("should submit donation", async () => {
    const response = await request(app)
      .post("/api/donations")
      .field("donorName", "Tester")
      .field("phone", "08123456789")
      .field("amount", 100000)
      .field("category", "Pembangunan");

    expect(response.status).toBe(201);

    donationId = response.body.data.id;

    expect(donationId).toBeDefined();
  });

  it("should verify donation", async () => {
    const response = await request(app)
      .put(`/api/donations/${donationId}/verify`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});