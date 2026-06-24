import { test, expect } from "@playwright/test"
import { login } from "./helpers/auth"

test("main business flow", async ({
  request,
}) => {

  const token =
    await login(request)

  //
  // 1. Create Attendance Session
  //
  const now = new Date()

const sessionResponse =
  await request.post(
    "/api/attendance",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      data: {
        title: "Playwright Session",

        type: "event",

        sessionDate: now,

        startTime: now,

        endTime: new Date(
          now.getTime() + 3600000
        ),

        notes: "E2E Test",
      },
    }
  )

expect(
  sessionResponse.status()
).toBe(201)

const session =
  await sessionResponse.json()

const sessionId =
  session.data.id
  //
  // 2. Submit Donation
  //
  const donationResponse =
  await request.post(
    "/api/donations",
    {
      multipart: {
        donorName: "Playwright Donor",
        phone: "08123456789",
        amount: "100000",
        categoryId: "1",
      },
    }
  )

expect(
  donationResponse.status()
).toBe(201)

const donation =
  await donationResponse.json()

const donationId =
  donation.data.id

  //
  // 3. Verify Donation
  //
  const verifyResponse =
  await request.put(
    `/api/donations/${donationId}/verify`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  )

expect(
  verifyResponse.status()
).toBe(200)

  //
  // 4. Attendance Check-In
  //
  const checkInResponse =
    await request.post(
      "/api/attendance/checkin",
      {
        data: {
          sessionId,

          nik:
            "3578010101010001",

          method:
            "manual",
        },
      }
    )

  expect(
    checkInResponse.ok()
  ).toBeTruthy()
})