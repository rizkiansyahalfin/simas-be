import express from "express";

const app = express();

app.use(express.json());

app.post("/api/auth/login", (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      token: "fake-token",
    },
  });
});

app.post("/api/finance/cash", (_req, res) => {
  return res.status(201).json({
    status: "success",
  });
});

app.post("/api/donations", (_req, res) => {
  return res.status(201).json({
    status: "success",
    data: {
      id: 1,
    },
  });
});

app.put("/api/donations/:id/verify", (_req, res) => {
  return res.status(200).json({
    status: "success",
  });
});

export default app;